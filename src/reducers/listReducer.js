import communesJSON from '../../Communes-belgique.json';
import update from 'immutability-helper';
import * as turf from '@turf/turf';

function getList(communes) {
    console.log('TIS PROPS GET LIST',this.props)
  const list = communes.map((commune, i) => {
    return getArea(commune, i);
  });

  console.log

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
  let polygon = feature.geometry.coordinates[0];
  let explored = 0;
  
  if (feature.geometry.coordinates.length > 1) {
      polygon = feature.geometry.coordinates[1]
      
      const  polygonExplored = turf.polygon([feature.geometry.coordinates[0]]);
      explored = turf.area(polygonExplored);
  }

  polygon = turf.polygon([polygon]);

  const area = turf.area(polygon);
  const percentage = explored / area * 100;
  const name = feature.properties.NAMN;

  return {
      id: i,
      area,
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

const initialState = getList(communesJSON.features);

export default function listReducer(state = initialState, { type, mask, i }) {
    console.log('LIST REDUCER', {type, state, mask, i});
    switch(type) {
        case 'COMPLETIONUPDATE':
            console.log('COMPLETIONUPDATE', {state, i, mask});

            const index = state.reduce((acc, curr, ind) => {
                if (curr.id == i) {
                    acc = ind
                }
                return acc;
            }, 0);

            return update(state, {
                [index]: { $set: getArea(mask, i) }
            });
    }
    
    return state;
}