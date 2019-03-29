import TileLayer from 'ol/layer/Tile.js'
import XYZ from 'ol/source/XYZ.js'

var app_id = 'w8FtxR42W4SUOihkhXeo'
var app_code = 'peClT6ii8YhkTUAmB16J_g'
var _ = {
  base: 'aerial',
  type: 'maptile',
  scheme: 'terrain.day',
  app_id,
  app_code
}
var url = `https://{1-4}.${_.base}.maps.cit.api.here.com/${_.type}/2.1/maptile/newest/${_.scheme}/{z}/{x}/{y}/256/png?app_id=${app_id}&app_code=${app_code}`

const HereLayer = new TileLayer({
  title: 'Here Maps Terrain',
  type: 'base',
  visible: true,
  preload: Infinity,
  source: new XYZ({
    url,
    attributions: `Map Tiles &copy;${new Date().getFullYear()} <a href="http://developer.here.com">HERE</a>`
  })
})

export default HereLayer