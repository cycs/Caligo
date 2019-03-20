import { request } from 'graphql-request'

const requestData = () => ({ type: 'REQUEST_DATA',  loading: true, error: null });
const requestDataSuccess = (data) => ({ type: 'REQUEST_DATA_SUCCESS', data, loading: false, error: null });
const requestDataError = (error) => ({ type: 'REQUEST_DATA_ERROR', data: [], loading: false, error });

export const fetchData = () => dispatch => {
    console.log('REQUEST_INITIAL')

    dispatch(requestData());
    
    return request('https://api.graph.cool/simple/v1/cjtfy59zu7gaj0138jz9a1xon', query)
        .then(data => {
            const json = {
                type: "FeatureCollection",
                features: [
                    ... data.allCommuneses.map((com) => JSON.parse(com.data))
                ],
                hasFetched: true,
            }

            console.log(json);    

            dispatch(requestDataSuccess(json))
        })
        .catch(error => {
            console.error(error);
            dispatch(requestDataError(error))
        })
}

const query = `{
    allCommuneses {
        id, 
        data
    }
}`

const getData = () => request('https://api.graph.cool/simple/v1/cjtfy59zu7gaj0138jz9a1xon', query);

export const communesUpdate = (mask, i) => {
    console.log('COMMUNESUPDATE', {mask, i})
    return {
        type: 'COMMUNESUPDATE',
        mask,
        i
    }
}

export const communesCompletion = (mask, i) => {
    console.log('COMPLETIONUPDATE', {mask, i})
    return {
        type: 'COMPLETIONUPDATE',
        mask,
        i
    }
}   

export const filterList = (text) => {
    return {
        type: 'COMPLETIONFILTER',
        text
    }
}