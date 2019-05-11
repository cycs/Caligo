import { AsyncStorage } from 'react-native';
import { request } from 'graphql-request';
import { GraphQLClient } from 'graphql-request';
import update from 'immutability-helper';
import communesJSON from '../../communes-minify.json';


const requestData = () => ({ type: 'REQUEST_DATA', loading: true, error: null });
const requestDataSuccess = (data) => ({ type: 'REQUEST_DATA_SUCCESS', data, loading: false, error: null });
const requestDataError = (error) => ({ type: 'REQUEST_DATA_ERROR', data: [], loading: false, error });

export const fetchData = () => dispatch => {
    // console.log('REQUEST_INITIAL')
    dispatch(requestData());

    return AsyncStorage.getItem('AUTH_TOKEN').then(token => { 
        const client = new GraphQLClient('https://api.graph.cool/simple/v1/cjtfy59zu7gaj0138jz9a1xon', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const userQuery = `{
            user {
                  id,
                  municipalities {id, data}
                }
              }
            `

        return client.request(userQuery)
            .then(data => {
                console.log(communesJSON, data)
                let newCommunes = communesJSON

                if(data.user.municipalities.length > 0) { 
                    newCommunes = communesJSON.features.map(current => {
                        const com = data.user.municipalities.find(o => {
                            const commune = JSON.parse(o.data)
                            return commune.properties.SHN === current.properties.SHN
                        })  

                        let newCom = null

                        if(com) {
                            newCom = JSON.parse(com.data)
                            newCom.id = com.id
                        }

                        return newCom || current
                    })

                    newCommunes = {
                        type: "FeatureCollection",
                        features: [
                            ... newCommunes
                        ],
                    }

                }
                
                // const newCommunes = communesJSON.features.map(current => {
                //     return data.user.municipalities.map((com) => {
                //         const commune = JSON.parse(com.data);
                //         if(current.properties.SHN == commune.properties.SHN){
                //             commune.id = com.id;
                //             return commune;
                //         }
                //     })
                // })
                
                console.log(newCommunes);

                // const json = {
                //     type: "FeatureCollection",
                //     features: [
                //         ... data.user.municipalities.map((com) => {
                //             const commune = JSON.parse(com.data);
                //             commune.id = com.id;
                //             return commune;
                //         })
                //     ],
                // }
                // const json = {
                //     type: "FeatureCollection",
                //     features: [
                //         ... newCommunes
                //     ],
                // }

                // console.log(json, data);

                dispatch(requestDataSuccess(newCommunes))
            })
            .catch(error => {
                console.error(error);
                dispatch(requestDataError(error))
            })
    });

}


const getData = () => request('https://api.graph.cool/simple/v1/cjtfy59zu7gaj0138jz9a1xon', query);

const updateQL = (state, stateId) => {
    const mutation = `
        mutation updateMunicipality ($id: ID!, $data: String!) {
            updateMunicipality(id: $id, data: $data) { id }
        }`;

        const variables = {
            id: stateId,
            data: state,
          };

    request('https://api.graph.cool/simple/v1/cjtfy59zu7gaj0138jz9a1xon', mutation, variables)
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error(error);
    })
}

export const communesUpdate = (mask, i, id) => {
    // console.log('COMMUNESUPDATE', {mask, i, id})

    const maskString = JSON.stringify(mask);
    updateQL(maskString, id);

    return {
        type: 'COMMUNESUPDATE',
        mask,
        i,
        id
    }
}

export const markersUpdate = (markers) => {
    return {
        type: 'MARKERSUPDATE',
        markers
    }
}

export const communesCompletion = (mask, i) => {
    // console.log('COMPLETIONUPDATE', {mask, i})
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