import Feature from 'ol/Feature.js'
import Map from 'ol/Map.js'
import View from 'ol/View.js'
import Point from 'ol/geom/Point.js'
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js'
import {fromLonLat} from 'ol/proj.js'
import TileJSON from 'ol/source/TileJSON.js'
import VectorSource from 'ol/source/Vector.js'
import { Icon, Text, Fill, Stroke, Style } from 'ol/style.js'
import GeoJSON from 'ol/format/GeoJSON'

export const DispatchLayer = new VectorLayer({
  title: 'Dispatch Boundaries',
  visible: true,
  source: new VectorSource({
    url: './nationalDispatchAreas.json', 
    format: new GeoJSON()
  }),  
  wrapX: false,
  minResolution: 0,
  maxResolution: 10000,
  style: (feature, resolution) => {
    const style = new Style({
      // fill: new Fill({
      //   color: 'rgba(244,67,54,0.5)'
      // }),
      stroke: new Stroke({
        color: 'rgba(7,7,7,0.8)', 
        width: 1
      }),
      text: new Text({
        font: '15px Montserrat, sans-serif',
        fill: new Fill({
          color: '#000'
        }),
        stroke: new Stroke({
          color: 'rgba(238, 238, 238, 1)',
          width: 3
        })
      })
    })
    const zone = feature.get('UnitID')
    // const { status } = isCritical[zone] || ''
   //  const color = {
   //    'notcritical': 'rgba(44, 107, 36, 0.8)',
   //    'critical': 'rgba(160, 35, 28, 0.8)',
   //    'approachingcritical': 'rgba(249, 238, 31, 0.8)',
   //  }[status] || 'rgba(176, 176, 176, 1)'
    // style.getFill().setColor(color)
    style.getText().setText(resolution < 5000 ? feature.get('UnitID') : '');
    return style
  }        
  // projection: 'EPSG:3857',
  // source: vectorSource,
  // name: 'rawsPoints',
  // visible: true,
  // // style: styleFunction
  // style: iconStyle
})

export const TestAreas = new VectorLayer({
  title: 'Test Areas',
  // visible: true, //was originally true when red test areas showed up on map
  visible: false,
  source: new VectorSource({
    url: './nationalDispatchAreasFiltered.json', 
    format: new GeoJSON()
  }),  
  wrapX: false,
  minResolution: 0,
  maxResolution: 10000,
  style: (feature, resolution) => {
    const style = new Style({
      fill: new Fill({
        color: 'rgba(244,67,54,0.5)'
      }),
      stroke: new Stroke({
        color: 'rgb(183, 183, 183)', 
        width: 2
      }),
      text: new Text({
        font: '15px Montserrat, sans-serif',
        fill: new Fill({
          color: '#000'
        }),
        stroke: new Stroke({
          color: 'rgba(238, 238, 238, 1)',
          width: 3
        })
      })
    })
    const zone = feature.get('UnitID')
    // const { status } = isCritical[zone] || ''
   //  const color = {
   //    'notcritical': 'rgba(44, 107, 36, 0.8)',
   //    'critical': 'rgba(160, 35, 28, 0.8)',
   //    'approachingcritical': 'rgba(249, 238, 31, 0.8)',
   //  }[status] || 'rgba(176, 176, 176, 1)'
    // style.getFill().setColor(color)
    style.getText().setText(resolution < 5000 ? feature.get('UnitID') : '');
    return style
  }        
  // projection: 'EPSG:3857',
  // source: vectorSource,
  // name: 'rawsPoints',
  // visible: true,
  // // style: styleFunction
  // style: iconStyle
})

