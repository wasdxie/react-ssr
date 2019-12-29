import React from 'react';
import {renderToString} from 'react-dom/server';
import express from 'express';
import App from '../src/App';
import {StaticRouter,matchPath,Route,Switch} from "react-router-dom";
import {getServerStore} from '../src/store/store'
import {Provider} from 'react-redux'
import routes from  '../src/App';
import Header from "../src/component/header";
const store = getServerStore()
const app = express();
import axios from 'axios';
import path from 'path';
import fs from 'fs';



//这里拦截  第二个问题
axios.interceptors.request.use(
    config => {
        if(config.url.indexOf('/kaikeba123/') >-1){
           config.url =   config.url.replace('/kaikeba123/','http://localhost:9090');
           console.log(config.url);
        }
        return config;
    },
    err => {
        
    });

app.use(express.static('public'));


function startCsr(res){
    //读取csr 文件
    const filename = path.resolve(process.cwd(),'public/index.csr.html');
    const html = fs.readFileSync(filename,'utf-8');
    console.log(html);
    return res.send(html)
}
//配置开关


app.get("*",(req,res)=>{
    console.log(req.path)
    if(req.query._mode=='csr'){
        console.log('url参数开启csr降级');
        return  startCsr(res);
    }
    if(req.path.indexOf('/kaikeba123/')> -1){//这里转发 第二个问题
        axios.get(req.path).then((restmp)=>{
            res.send(restmp.data)
        })
        
    }else{

        const promises= [];
        routes.some((route)=>{
            const match = matchPath(req.path,route);
            if(match){
                const {loadData} = route.component;
                if(loadData){
                    promises.push(
                        //多包一层,把loadData产生的错误给吃掉  第一个问题
                        new Promise(function(resolve,reject){
                            loadData(store).then(()=>{resolve()}).catch((e)=>{
                               // console.log(e);
                                resolve()
                            })
                        })
                        )
                   // loadData(store);
                }
            }
        })
       // const Page = <App title="kaikeba"></App>;
       //获取根据路由渲染出来的组件，
    
       Promise.all(promises).then(()=>{
           const context = {
               css:[]
           }
        const content = renderToString(
            <Provider store={store}>
                <StaticRouter location={req.url}  context={context}>
                  <Header></Header>
                  <Switch>
                    {routes.map((route)=><Route {...route} key={route.key}></Route>)}
                  </Switch>
               
            </StaticRouter>
            </Provider>
        );

        console.log('context',context)
        if(context.statuscode){
             res.status(context.statuscode)
        }

        if(context.action == 'REPLACE'){
            res.redirect(301,context.url)
        }
        const css = context.css.join('\n')
            res.send(`
            <html>
                <head>
                    <meta charset="utf-8"/>
                    <title>react ssr</title>
                    <style>${css}</style>
                </head>
                <body>
                    <div id="root">${content}</div>
                    <script>
                      window.__context = ${JSON.stringify(store.getState())}
                    </script>
                </body>
                <script src="/bundle.js"></script>
            </html>
        `)
        

       }).catch((e)=>{
           console.log(e);
            res.send('报错501')
       })
    }

 
})

app.listen(9093,()=>{
    console.log('监听完毕')
})