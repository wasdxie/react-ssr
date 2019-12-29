import React from 'react';
import {Route} from 'react-router-dom'

function Status({code,children}){
    return <Route render={({staticContext})=>{
        console.log(staticContext,222222);
        if(staticContext){
            staticContext.statuscode = code;
        }
        return children
    }}></Route>
}

function NotFind(props){
    console.log('notfond',props);
    return (
        <Status code={404}>
            <h1>大兄弟你愁啥那</h1>
        </Status>
    )
}


export default NotFind;