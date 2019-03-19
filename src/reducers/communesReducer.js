// import communesJSON from '../../Communes-belgique.json';
import communesJSON from '../../communes-minify.json';
import update from 'immutability-helper';
import * as turf from '@turf/turf';

function getList(communes) {
    // console.log('TIS PROPS GET LIST',this.props)
  const list = communes.map((commune) => {
    return getArea(commune);
  });

  return list;
}

function getArea(feature) {
    // console.log(feature);
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
  
  // console.log(area, explored, percentage, name);

  return {
      area,
      explored,
      percentage,
      name
  }
}

// const list = getList(communesJSON.features);

const initialState = {
    communes: communesJSON
}

// console.log('COMMUNES REDUCER LIST', list)

export default function communesReducer(state = initialState, { type, mask, i }) {
    switch(type) {
        case 'COMMUNESUPDATE':
        console.log('COMMUNESUPDATE', {mask, i});
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