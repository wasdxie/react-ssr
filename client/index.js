import React from 'react';
import ReactDom from 'react-dom';
import {BrowserRouter,Route,Switch} from 'react-router-dom';
import Header from "../src/component/header";
import routes from '../src/App';
import {getClientStore} from '../src/store/store'
import {Provider} from 'react-redux'
import axios from 'axios';

//这里拦截 第二个问题
axios.interceptors.request.use(
    config => {
        if(config.url.indexOf('http://localhost:9090') > -1){
           config.url =   config.url.replace('http://localhost:9090','/kaikeba123/');
        }
        return config;
    },
    err => {
        
    });

const Page = (
    <Provider store={getClientStore()}>
        <BrowserRouter>
            <Header></Header>
            <Switch>
                {routes.map((route)=>{return <Route {...route} key={route.key}></Route>})}
            </Switch>
        </BrowserRouter>
    </Provider>
)

if(window._context){
    ReactDom.hydrate(Page,document.getElementById('root'));
}else{
    ReactDom.render(Page,document.getElementById('root'));
}
