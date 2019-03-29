import Feature from 'ol/Feature.js'
import Map from 'ol/Map.js'
import View from 'ol/View.js'
import Point from 'ol/geom/Point.js'
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js'
import {fromLonLat} from 'ol/proj.js'
import TileJSON from 'ol/source/TileJSON.js'
import VectorSource from 'ol/source/Vector.js'
import {Circle as CircleStyle, Icon, Text, Fill, Stroke, Style } from 'ol/style.js'
import GeoJSON from 'ol/format/GeoJSON'
import raws from '../../data/rawsLocations.json'
import monthlyErcs from '../../data/monthlyErcs' 

var iconStyle = new Style({
  image: new CircleStyle({
    radius: 7,
    fill: new Fill({
      color: 'white'
    }),
    stroke: new Stroke({
      color: 'black'
    })
  }),
});

var vectorSource = new VectorSource({
  features: (new GeoJSON()).readFeatures(raws, {
    dataProjection : 'EPSG:4326', 
    featureProjection: 'EPSG:3857'
  })  
});

var createTextStyle = function(feature, resolution) {
  return new Text({
    textAlign: 'end',
    text: resolution < 2000 ? feature.get('name') : '',
    stroke: new Stroke({color: 'white', width: 2}),
    offsetX: 8
  });
};

var rawsStyleFunction = function(feature,resolution){
  var currStn = feature.get('id')
  var allStns = []
  monthlyErcs.map(curr => {
    for(var stn in curr){
      allStns.push(stn)
    }
  })
  var stnSet = new Set(allStns)
  if(stnSet.has(currStn) == true){
    var clr = '#2d2f30'
  }
  else{
    var clr = '#e3e6e7'
    console.log('nodata for: ', currStn)
  }
  var style = new Style({
        image: new CircleStyle({
            radius: 8,
            fill: new Fill({
              color: clr
            }),
            stroke: new Stroke({
              color: 'black'
            })
          }),
        text: createTextStyle(feature,resolution)
      })
  return style
}

const RawsLayer = new VectorLayer({
  source: vectorSource, 
  wrapX: false,
  minResolution: 0,
  maxResolution: 2000,
  visible: true,
  style: rawsStyleFunction
  // style: (feature, resolution) => {
  //   const style = new Style({
  //     fill: new Fill({
  //       color: 'rgba(255, 255, 255, 0.1)'
  //     }),
  //     stroke: new Stroke({
  //       color: 'rgb(183, 183, 183)', 
  //       width: 2
  //     }),
  //     text: new Text({
  //       font: '15px Montserrat, sans-serif',
  //       fill: new Fill({
  //         color: '#000'
  //       }),
  //       stroke: new Stroke({
  //         color: 'rgba(238, 238, 238, .7)',
  //         width: 3
  //       })
  //     })
  //   })
  //   // const zone = feature.get('STATE_ZONE')
  //   // const { status } = isCritical[zone] || ''
  //  //  const color = {
  //  //    'notcritical': 'rgba(44, 107, 36, 0.8)',
  //  //    'critical': 'rgba(160, 35, 28, 0.8)',
  //  //    'approachingcritical': 'rgba(249, 238, 31, 0.8)',
  //  //  }[status] || 'rgba(176, 176, 176, 1)'
  //   // style.getFill().setColor(color)
  //   // style.getText().setText(resolution < 5000 ? feature.get('STATE_ZONE') : '');
  //   return style
  // }        
  // projection: 'EPSG:3857',
  // source: vectorSource,
  // name: 'rawsPoints',
  // visible: true,
  // // style: styleFunction
  // style: iconStyle
});

export default RawsLayer