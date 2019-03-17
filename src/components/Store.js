import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import communesReducer from '../reducers/communesReducer';
import listReducer from '../reducers/listReducer';
import reducers from '../reducers'
import { composeWithDevTools } from 'remote-redux-devtools';
import communesJSON from '../../Communes-belgique.json';

const initialState = communesJSON;

const middleware = [thunk];

const composeEnhancers = composeWithDevTools({ realtime: true });

const allReducers = combineReducers({
    communes: communesReducer,
    list: listReducer
    // list: communesReducer
})


// console.log('allreducers', allReducers)
// const store = createStore(communesReducer, applyMiddleware(...middleware));

// const store = createStore(communesReducer);
const store = createStore(allReducers);

// console.log('STORE GETSTATE', store.getState());


export default store;   