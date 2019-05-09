import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import communesReducer from '../reducers/communesReducer';
import listReducer from '../reducers/listReducer';
import reducers from '../reducers'
import { composeWithDevTools } from 'remote-redux-devtools';
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'
// import communesJSON from '../../Communes-belgique.json';

// const initialState = communesJSON;

const middleware = [thunk];

// const composeEnhancers = composeWithDevTools({ realtime: true });

const allReducers = combineReducers({
    communes: communesReducer,
    list: listReducer
    // list: communesReducer
})

const persistConfig = {
    key: 'root',
    storage: storage,
    whitelist: ['communes'],
    timeout: null,
}

const pReducer = persistReducer(persistConfig, allReducers);

// console.log('allreducers', allReducers)
// const store = createStore(communesReducer, applyMiddleware(...middleware));

// const store = createStore(communesReducer);
export const store = createStore(pReducer, applyMiddleware(...middleware));
export const persistor = persistStore(store);
persistor.purge()
// console.log('STORE GETSTATE', store.getState());


// export default store;   