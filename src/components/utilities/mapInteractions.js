import { click } from 'ol/events/condition.js'
import { Text, Fill, Stroke, Style } from 'ol/style.js'
import Select from 'ol/interaction/Select'
import { TestAreas, DispatchLayer } from '../layers/DispatchLayer'
import { polygonSource, polygonLayer } from '../layers/scaledLayer'
import Draw from 'ol/interaction/Draw.js'


export const selectClick = new Select({
  condition: click,
  // layers: [ DispatchLayer, TestAreas ], //this includes the red highlighted test areas layery
  layers: [ DispatchLayer ],
  style: feature => {
    const selected = feature.get('name')
    return new Style({
      stroke: new Stroke({
        color: '#f00',
        width: 3
      }),
      text: new Text({
        font: '15px Montserrat, sans-serif',
        stroke: new Stroke({color: '#e600fb', width: 4}),
        fill: new Fill({color: 'white', width:2}),
        backgroundFill: new Fill({color: '#a1ebf6'}),
        text: selected
      })
    })
  }      
})

export const draw = new Draw({ 
  source: polygonSource,
  type: 'Polygon',
  layers: [ polygonLayer ],
})    

