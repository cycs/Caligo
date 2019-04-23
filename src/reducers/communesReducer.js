// import communesJSON from '../../Communes-belgique.json';
import communesJSON from '../../communes-minify.json';
import update from 'immutability-helper';
import { request } from 'graphql-request'

const query = `{
    allCommuneses {
        id, 
        data
    }
}`
  
// request('https://api.graph.cool/simple/v1/cjtfy59zu7gaj0138jz9a1xon', query)
//     .then(data => {
//         const json = {
//             type: "FeatureCollection",
//             features: [
//                 ... data.allCommuneses.map((com) => JSON.parse(com.data))
//             ]
//         }

//         console.log(data, json);

//         return json;
//     })

const initialState = {
    communes: [],
    loading: true
}

export default function communesReducer(state = initialState, { type, mask, i, data, loading, error }) {
    // console.log('COMMUNESUPDATE TOP', state);
    
    switch(type) {
        case "REQUEST_DATA":
            return {
                ...state,
                loading: loading,
                communes: []
            }
        case "REQUEST_DATA_SUCCESS":
            return {
                ...state,
                loading: loading,
                communes: data
            }
        case "REQUEST_DATA_ERROR":
            // console.log('error', state)
            return {
                ...state,
                communes: [],
                loading: loading,
                error: error
            }
        case 'REQUEST_INITIAL': 
            return {
                ...state,
                isFetching: true,
            };
        case 'GET_DATA_FIRST': 
            return {
                ...state,
                isFetching: false,
                communes: myData
            };
        case 'COMMUNESUPDATE':
            // console.log('COMMUNESUPDATE', {state, mask, i});
            return update(state, {
                communes: {
                    features: {
                        [i]: {$set: mask}
                    }
                }
            });
    }
    
    return state;
}