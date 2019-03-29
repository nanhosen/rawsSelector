import VectorSource from 'ol/source/Vector.js'
import { Vector as VectorLayer } from 'ol/layer.js'
import { Icon, Text, Fill, Stroke, Style } from 'ol/style.js'

export let scaledSource = new VectorSource()    
export let scaledLayer = new VectorLayer({
  title: 'Buffered Boundary Layer',
  visible: false,
  source: scaledSource,
  style: (feature, resolution) => {
    const style = new Style({
      fill: new Fill({
        color: 'rgba(244,67,54,0)'
      }),
      stroke: new Stroke({
        color: 'rgb(183, 183, 183)', 
        width: 2
      }),
      // text: new Text({
      //   font: '15px Montserrat, sans-serif',
      //   fill: new Fill({
      //     color: '#000'
      //   }),
      //   stroke: new Stroke({
      //     color: 'rgba(238, 238, 238, 1)',
      //     width: 3
      //   })
      // })
    })
    // const zone = feature.get('UnitID')
    // style.getText().setText(resolution < 5000 ? feature.get('UnitID') : '');
    return style
  }  
})

export let polygonSource = new VectorSource({wrapX: false})
export let polygonLayer = new VectorLayer({ 
  title: 'Custom Polygon Layer',
  visible: true,
  source: polygonSource,
})