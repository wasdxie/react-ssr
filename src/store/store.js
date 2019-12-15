import {createStore,applyMiddleware,combineReducers} from 'redux';
import thunk from 'redux-thunk';
import indexReducer from './index';
import userReducer from './user';

const reducer = combineReducers({
    index:indexReducer,
    user:userReducer
})

const store = createStore(reducer,applyMiddleware(thunk))

//export default store
export const getServerStore=()=>{
    return createStore(reducer,applyMiddleware(thunk))
}

export const getClientStore=()=>{
    const defaultState = window.__context?window.__context:{}
    return createStore(reducer,defaultState,applyMiddleware(thunk))
}