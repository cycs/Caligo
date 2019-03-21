import { request } from 'graphql-request'

const requestData = () => ({ type: 'REQUEST_DATA', loading: true, error: null });
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
                    ... data.allCommuneses.map((com) => {
                        const commune = JSON.parse(com.data);
                        commune.id = com.id;

                        return commune;
                    })
                ],
            }

            console.log(json);
            console.log(data);

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

const updateQL = (state, stateId) => {
    const mutation = `
        mutation updateCommunes ($id: ID!, $data: String!) {
            updateCommunes(id: $id, data: $data) { id }
        }`;

        const variables = {
            id: stateId,
            data: state,
          };
          console.log(variables)

    request('https://api.graph.cool/simple/v1/cjtfy59zu7gaj0138jz9a1xon', mutation, variables)
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error(error);
    })
}

export const communesUpdate = (mask, i, id) => {
    console.log('COMMUNESUPDATE', {mask, i, id})
    const maskString = JSON.stringify(mask);
    updateQL(maskString, id);

    return {
        type: 'COMMUNESUPDATE',
        mask,
        i,
        id
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