import React,{useState} from 'react';
import {Route} from 'react-router-dom';
import Index from "./container/index";
import About from "./container/About";
import User from "./container/User";
import NotFind from "./container/notfind";
//import "./App.css"

//export default App

export default [
    {
        path:'/',
        component:Index,
        exact:true,
        key:'index'
    },
    {
        path:'/about',
        component:About,
        exact:true,
        key:'about'
    },
    {
        path:'/user',
        component:User,
        exact:true,
        key:'user'
    },
    {
        component:NotFind,
        key:'notfind'
    }
]