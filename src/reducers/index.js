import { combineReducers } from 'redux';

import communesReducer from './communesReducer';
import listReducer from './listReducer';

export default combineReducers({
    communes: communesReducer,
    list: listReducer
});