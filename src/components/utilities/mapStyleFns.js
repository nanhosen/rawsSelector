import {Circle as CircleStyle, Icon, Text, Fill, Stroke, Style } from 'ol/style.js'

export function resetRawsStyle(raws){
  raws.forEach(raw => {
    raw.setStyle(new Style({
      image: new CircleStyle({
        radius: 8,
        fill: new Fill({
          color: 'white'
        }),
        stroke: new Stroke({
          color: 'black'
        })
      }),
      text: new Text({
        textAlign: 'end', 
        // text: resolution < 2000 ? feature.get('name') : '',
        text:  raw.get('name'),
        stroke: new Stroke({color: 'white', width: 2}),
        // backgroundFill: new Fill({color: 'black'}),
        // backgroundStroke: new Fill({color: 'green'}),
        offsetX: 8
      })
    }))
  })
  console.log(raws)
  raws.clear()
}

export function colorByCluster(raws, colorMap)  {
  raws.forEach(raw => {
    let color 
    colorMap.get(raw.values_.id) == undefined ? color = '#e2e2e2' : color = colorMap.get(raw.values_.id)
    let { id, name } = raw.values_
    var label = name + ': ' + id
    raw.setStyle(new Style({
      image: new CircleStyle({
        radius: 9,
        fill: new Fill({ color }),
        stroke: new Stroke({ color: 'black' })
      }),
      text: new Text({
        textAlign: 'end',
        text: label,
        stroke: new Stroke({ color: '#605f5f', width: 5 }),
        fill: new Fill({ color: 'white', width: 5 }),
        backgroundFill: new Fill({ color, width: 5 }),
        backgroundStroke: new Stroke({ color: '#605f5f', width: 1 }),
        offsetX: 13
      })
    }))
  })
} 