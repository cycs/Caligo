// import communesJSON from '../../Communes-belgique.json';
import communesJSON from '../../communes-minify.json';
import update from 'immutability-helper';
// import * as turf from '@turf/turf';

import { polygon } from '@turf/helpers';
import area from '@turf/area';

console.log(area)

function getList(communes) {
    // console.log('TIS PROPS GET LIST',this.props)
  const list = communes.map((commune, i) => {
    return getArea(commune, i);
  });

  return list;
}

function getArea(feature, i) {
    if (
        feature.properties.SHN == "BE421009" ||
        feature.properties.SHN == "BE213002" ||
        feature.properties.SHN == "BE233016"
        )  {
        return {area: 0, explored: 0, percentage: 0, name: feature.properties.NAMN}
    }
  let newPolygon = feature.geometry.coordinates[0];
  let explored = 0;
  
  if (feature.geometry.coordinates.length > 1) {
    newPolygon = feature.geometry.coordinates[1]
      
      const  polygonExplored = polygon([feature.geometry.coordinates[0]]);
      explored = area(polygonExplored);
  }

  newPolygon = polygon([newPolygon]);

  const newArea = area(newPolygon);
  const percentage = explored / newArea * 100;
  const name = feature.properties.NAMN;

  return {
      id: i,
      area: newArea,
      explored,
      percentage,
      name
  }
}

const obj = {
    type:"fet",
    features: [
        {type: "Feature", geometry: 0, properties: ''}
    ]
}

const communesList = getList(communesJSON.features);

const initialState = {
    source: getList(communesJSON.features),
    filter: getList(communesJSON.features)
};

export default function listReducer(state = initialState, { type, mask, i, text }) {
    switch(type) {
        case 'COMPLETIONUPDATE':
            console.log('COMPLETIONUPDATE', {state, i, mask});

            const indexSource = state.source.reduce((acc, curr, ind) => {
                if (curr.id == i) {
                    acc = ind
                }
                return acc;
            }, 0);
            
            const indexFilter = state.filter.reduce((acc, curr, ind) => {
                // console.log(curr, i, ind)
                if (curr.id == i) {
                    acc = ind
                }
                return acc;
            }, null);

            if(!indexFilter) {
                return update(state, {
                    source: {
                        [indexSource]: { $set: getArea(mask, i) }
                    }
                })
            }

            return update(state, {
                source: {
                    [indexSource]: { $set: getArea(mask, i) }
                },
                filter: {
                    [indexFilter]: { $set: getArea(mask, i) }
                }
            });
        case 'COMPLETIONFILTER':
            console.log(state)

            const copy = state.source;
            const newState = copy.filter(item => {
                console.log(text)
                return item.name.indexOf(text) > -1;
            });

            return {
                source: state.source,
                filter: newState
            };

    }
    
    return state;
}