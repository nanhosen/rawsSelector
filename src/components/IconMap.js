import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import { store } from '../index.js'
 
import * as turf from '@turf/turf'
import * as helpers from '@turf/helpers'

import {inherits} from 'ol/util.js'
import {createStringXY} from 'ol/coordinate.js'
import MousePosition from 'ol/control/MousePosition'
import Overlay from 'ol/Overlay';
import {toLonLat} from 'ol/proj.js';
import {toStringHDMS} from 'ol/coordinate.js';
import Zoom from 'ol/control/Zoom'
import Map from 'ol/Map.js'
import View from 'ol/View.js'
import { defaults as defaultControls, OverviewMap, Control } from 'ol/control.js'
import { Group as LayerGroup, Tile as TileLayer } from 'ol/layer.js'
import Stamen from 'ol/source/Stamen'
import { scaledSource, scaledLayer, polygonSource, polygonLayer } from './layers/scaledLayer'
import {Icon, Text, Fill, Stroke, Style } from 'ol/style.js'
import GeoJSON from 'ol/format/GeoJSON'
import Collection from 'ol/Collection'
import LayerSwitcher from './utilities/LayerSwitcher'
import app from './utilities/sidebar'
import Feature from 'ol/Feature.js'


import HereLayer from './layers/HereLayer'
import { DispatchLayer, TestAreas } from './layers/DispatchLayer'
import RawsLayer from './layers/RawsLayer'
import MapboxLayer from './layers/MapboxLayer'

import SelectK from './SelectK'
import SliderDates from './SliderDates1'
// import { selectClick } from './utilities/mapInteractions'
import { draw, si } from './utilities/mapInteractions'
import { resetRawsStyle, colorByCluster } from './utilities/mapStyleFns'
import { makeMonthlyERC } from './utilities/makeMonthlyERC'
import { calculatePca } from './stats/calculatePca'
import { kMeansCluster, getClusterColors } from './stats/kMeansCluster'

import { getDispatch, initRawsData, selectK, setMonths } from '../actions' 
class IconMap extends Component {
  state = { 
    stations: RawsLayer.getSource().getFeatures(),
    raws: new Collection([], { unique: true }),
    selectedRaws: null,
    k: 1,
    monthRange: [0, 11],
  }

  handleResizedScreen = () => setTimeout(() => {
    this._map.getView().fit([ -13385849.855545742, 4164163.9360093023, -12120670.513975333, 5733155.322681262 ], (this._map.getSize()), {padding: [10, 20, 50, 20], constrainResolution: false})
  }, 200)

  componentDidMount() {

    window.addEventListener("resize", this.handleResizedScreen)
    var componentDidMountThis = this
  //   var container = document.getElementById('popup')
  //   var content = document.getElementById('popup-content')
  //   var closer = document.getElementById('popup-closer')

  //   var overlay = new Overlay({
  //     element: container,
  //     autoPan: true,
  //     autoPanAnimation: {
  //       duration: 250
  //     }
  //   })

  // closer.onclick = function() {
  //   overlay.setPosition(undefined);
  //   closer.blur();
  //   return false;
  // }

      // const convertToClick = e => {
      //   console.log('convertToClick', e)
      //   const evt = new MouseEvent('click', { bubbles: true })
      //   evt.stopPropagation = () => {}
      //   e.target.dispatchEvent(evt)
      //   console.log(e.target.draggable)
      //   // e.target.draggable = true
      // }
    app.SliderDates = function(settings) {

      var defaults = {
        element: null,
        position: 'left'
      };



      this._options = Object.assign({}, defaults, settings)      
      // this.convertToClick = e => {
      //   console.log('convertToClick', e)
      //   const evt = new MouseEvent('click', { bubbles: true })
      //   evt.stopPropagation = () => {}
      //   e.target.dispatchEvent(evt)
      //   console.log(e.target.draggable)
      //   // e.target.draggable = true
      // }

      // console.log(this.convertToClick)
      // var sliderDiv = document.createElement('div')
      // sliderDiv.id = 'sliderDiv'
      // sliderDiv.className = 'rotate-north ol-unselectable ol-control slider-bar'
      // // sliderDiv.addEventListener('mousedown', e => console.log('hello ryan'))
      // console.log(document.getElementsByClassName('ol-overlaycontainer-stopevent'))
      // sliderDiv.addEventListener('mouseup', e => this.convertToClick(e), false)
      Control.call(this, {
        // element: componentDidMountThis.sliderDiv,
        element: document.getElementById(this._options.element),
        target: this._options.target
      })

    }
    inherits(app.SliderDates, Control)

    app.SelectK = function(opt_options) {
      // var kVal = componentDidMountThis.props.kValue
      // var options = opt_options || {}
      // var select = document.createElement('select')
      // select.style.width = '150px'
      // // select.innerHTML = '<form><select><option value=""># of Clusters</option>'
      // // select.innerHtml += '<option value="' + kVal + '">' + kVal + '</option><option value="2">2</option></select></form>'

      // var this_ = this
      // console.log(this)
      // var layerToggle = function() {
      //   this_.getMap().getView().setRotation(0)
      //   var visibility = scaledLayer.getVisible()
      // }

      // select.addEventListener('click', layerToggle, false)
      // select.addEventListener('touchstart', layerToggle, false)

      var element = document.createElement('div')
      element.className = 'ol-control select-k'
      element.id = 'selectKDiv'

      Control.call(this, {
        element,
        // target: options.target
      })
    }
    inherits(app.SelectK, Control)

    const mousePositionControl = new MousePosition({
      coordinateFormat: createStringXY(4),
      projection: 'EPSG:4326',
      undefinedHTML: 'outside'
    })

 
  // console.log('monthlyErcs', monthlyErcs, this.state.stations)
  // var findMissing = function(feature,resolution){
  //   var missingStnAr = []
  //   var allStns = []
  //   monthlyErcs.map(curr => {
  //     for(var stn in curr){
  //       allStns.push(stn)
  //     }
  //   })
  //   var stnSet = new Set(allStns)
  //   console.log('stnSet', stnSet)
  //   feature.map(curr => {
  //     var currStn = curr.values_.id
  //     if(stnSet.has(currStn) == true){
  //         // console.log(currStn + "has data")
  //       }
  //       else{
  //         missingStnAr.push(currStn) 
  //       }
  //   })
  //   console.log('missing station array', JSON.stringify(missingStnAr), missingStnAr.length)
  // }
      // findMissing(this.state.stations)
    const newMap = new Map({
      controls: [
        new app.Sidebar({ element: 'sidebar' }),
        // mousePositionControl, 
        new OverviewMap(),
        new Zoom(),
        new app.SelectK(), 
        // new app.SliderDates({ element: 'sliderDiv' })
      ],
      layers: [
        new LayerGroup({
          title: 'Base Maps',
          layers: [
            MapboxLayer,          
            new LayerGroup({
              title: 'Stamen Terrain with Labels',
              type: 'base',
              combine: true,
              visible: false,
              layers: [
                new TileLayer({
                  source: new Stamen({
                    layer: 'terrain'
                  })
                }),          
                new TileLayer({
                  source: new Stamen({
                    layer: 'terrain-labels'
                  })
                }),
              ]
            }),
            HereLayer,
          ]
        }),        
        new LayerGroup({
          title: 'Overlays',
          // layers: [
          //   DispatchLayer,
          //   TestAreas,          
          //   scaledLayer,
          //   RawsLayer,
          //   polygonLayer,
          // ]
          layers: [
            DispatchLayer,      
            RawsLayer,
            polygonLayer,
          ]
        })
      ],
      // overlays: [overlay],
      target: this.olmap,
      view: new View({
        center: [-12753260.184760537, 4948659.629345282],
        zoom: 5.6,
        // minZoom: 5,
        // maxZoom: 9.8,
        // extent:[ -13385849.855545742, 4164163.9360093023, -12120670.513975333, 5733155.322681262 ]
      })
    })
    this._map = newMap
    this._map.getView().fit([ -13385849.855545742, 4164163.9360093023, -12120670.513975333, 5733155.322681262 ], (this._map.getSize()), {padding: [10, 20, 50, 20], constrainResolution: false})
    LayerSwitcher.whatIsThis(this)
    LayerSwitcher.renderPanel(this._map, this.layerswitcher, this)
    console.log('layerswitcher', this.layerswitcher)
    
    draw.setActive(true)
    this._map.addInteraction(draw)
    // selectClick.setActive(true)
    // this._map.addInteraction(selectClick)

    // this._map.on('singleclick', function(evt) {
    //   var coordinate = evt.coordinate;
    //   var hdms = toStringHDMS(toLonLat(coordinate));

    //   content.innerHTML = '<p>You clicked here:</p><code>' + hdms +
    //       '</code>';
    //   overlay.setPosition(coordinate);
    // });

    draw.on('drawend', e => {
      // console.log(this.state)
      var monthlyErcs = this.props.initData.stnErcData
      // console.log('monthlyErcs', this.props)
      
      if (!this.state.raws.length) {
        // "4" is the index of the polygonLayer in the layers array
        // this._map.getLayers().getArray()[1].values_.layers.array_[4].getSource().clear() //changed from 4 to 3 since deleted test layer
        // console.log('layers', this._map.getLayers().getArray())
        this._map.getLayers().getArray()[1].values_.layers.array_[2].getSource().clear()
        resetRawsStyle(this.state.raws)
        this.setState({ raws: new Collection([], { unique: true }) })
      } 
      this.props.selectK(1)
      let raws = new Collection([], { unique: true })
      let selectedRaws = []
      const polygon = e.feature.getGeometry()
      var size = (this._map.getSize())  
      this._map.getView().fit(polygon, size, {padding: [80, 80, 80, 80], constrainResolution: false})
      for (let station of this.state.stations) {
        polygon.intersectsExtent(station.getGeometry().getExtent()) && 
          raws.push(station)
      }
      raws.forEach(raw => {
        let { id, name } = raw.values_
        selectedRaws.push({ id, name })
      })

      if (selectedRaws.length < 2 ) {
        this._map.getLayers().getArray()[1].values_.layers.array_[2].getSource().clear()
        resetRawsStyle(this.state.raws)
        this.props.initRawsData()
        this.setState({ raws: new Collection([], { unique: true }) })
        return
      }
      
      this.props.initRawsData(selectedRaws, this.state.monthRange, this.state.k)
      // console.log('len', selectedRaws.length, this, this.props.initData == undefined)
      var pcaVals = calculatePca(selectedRaws, this.state.monthRange)
      var kmeansGroups = kMeansCluster(pcaVals, this.state.k)
      var colorMap = getClusterColors(kmeansGroups.stnPosition)
      
      let nameMap = new Map()
      raws.forEach(raw => {
        let { id, name } = raw.values_
        nameMap.set(id, name)
      })
      colorByCluster(raws, colorMap)
      
      this.setState({ raws, selectedRaws })     
    })   
     
    // selectClick.on('select', e => {

    // // console.log(document.getElementById('headerbar')) 

    //   // var coordinate = e.coordinate;
    //   // console.log(coordinate)
    //   // var hdms = toStringHDMS(toLonLat(coordinate));

    //   // content.innerHTML = '<p>You clicked here:</p><code>' + hdms +
    //       // '</code>';
    //   // overlay.se      // var x = document.getElementsByClassName('ol-overlaycontainer-stopevent')[0]
    //   // x.addEventListener('mouseup', e => convertToClick(e), false)tPosition(coordinate);

    //   // .className = 'ol-overlaycontainer'
    //   if (!this.state.raws.length) {
    //     // "2" is the index of the scaledLayer in the layers array
    //     this._map.getLayers().getArray()[1].values_.layers.array_[2].getSource().clear()
    //     resetRawsStyle(this.state.raws)
    //     this.setState({ raws: new Collection([], { unique: true }) })
    //   }
    //   this.props.selectK(1)
    //   let raws = new Collection([], { unique: true })
    //   let selectedRaws = []

    //   let feature = e.selected[0]
    //   if (feature) {
    //     var polygon = feature.getGeometry()
    //     this.props.getDispatch(feature.get('UnitID'))
    //     var size = (this._map.getSize())  
    //     this._map.getView().fit(polygon, size, {padding: [80, 80, 80, 80], constrainResolution: false})

    //     let buffer = this._map.getLayers().getArray()[1].values_.layers.array_[2].state_.visible
    //     if (buffer) {
    //       var poly = !polygon.appendPolygon 
    //         ? turf.toWgs84(helpers.polygon(polygon.getCoordinates()))
    //         : turf.toWgs84(helpers.multiPolygon(polygon.getCoordinates()))
    //       var scaledPoly = turf.buffer(poly, 20, { units: 'miles' })
    //       this._map.getLayers().getArray()[1].values_.layers.array_[2].getSource().addFeatures((new GeoJSON()).readFeatures(turf.toMercator(scaledPoly)))
    //       var scaledIntersectionRawsPoly = (new GeoJSON()).readFeature(turf.toMercator(scaledPoly)).getGeometry()
    //       for (let station of this.state.stations) {
    //         scaledIntersectionRawsPoly.intersectsExtent(station.getGeometry().getExtent()) && 
    //           raws.push(station)
    //       }
    //     }
    //     else {
    //       for (let station of this.state.stations) {
    //         polygon.intersectsExtent(station.getGeometry().getExtent()) && 
    //           raws.push(station)
    //       }
    //     }
    //     raws.forEach(raw => {
    //       let { id, name } = raw.values_
    //       selectedRaws.push({ id, name })
    //     })

    //     this.props.initRawsData(selectedRaws, this.state.monthRange, this.state.k)
    //     var pcaVals = calculatePca(selectedRaws, this.state.monthRange)
    //     var kmeansGroups = kMeansCluster(pcaVals, this.state.k)
    //     var colorMap = getClusterColors(kmeansGroups.stnPosition)
        
    //     colorByCluster(raws, colorMap)
    //     let nameMap = new Map()
    //     raws.forEach(raw => {
    //       let { id, name } = raw.values_
    //       nameMap.set(id, name)
    //     })
        
    //     this.setState({ raws, selectedRaws })
    //   }
    // })

  }

  clusterGrouping(selectedRaws, monthRange, kValue, raws) {
    var pcaVals = calculatePca(selectedRaws, monthRange)
    var kmeansGroups = kMeansCluster(pcaVals, kValue)
    var colorMap = getClusterColors(kmeansGroups.stnPosition)
    colorByCluster(this.state.raws, colorMap)
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('this updates', this, this.monthlyErcs)

    if (prevProps.kValue !== this.props.kValue){
      if (!Object.keys(this.props.initData).length) { return }
      this.props.initRawsData(this.state.selectedRaws, this.state.monthRange, this.props.kValue)
      this.clusterGrouping(this.state.selectedRaws, this.props.monthRange, this.props.kValue, this.state.raws)
      this.setState({ k: this.props.kValue })
    }
    if (this.props.monthRange !== prevProps.monthRange) {
      if (!Object.keys(this.props.initData).length) { return }
      this.props.initRawsData(this.state.selectedRaws, this.props.monthRange, this.props.kValue)
      this.clusterGrouping(this.state.selectedRaws, this.props.monthRange, this.props.kValue, this.state.raws)
      this.setState({ monthRange: this.props.monthRange })
    }
  }

  componentWillUnmount = () => window.removeEventListener("resize", this.handleResizedScreen)
  render = () => {
    // console.log('this render', this)
    return (
      <div className='card h-100 border-0' id = "one">
        <div id="sidebar" className="sidebar collapsed">

          <div className="sidebar-tabs">
            <ul role="tablist">
              <li><a href="#home" role="tab"><i className="fa fa-bars"></i></a></li>
              <li><a href="#profile" role="tab"><i className="fa fa-user"></i></a></li>
              <li className="disabled"><a href="#messages" role="tab"><i className="fa fa-envelope"></i></a></li>
              <li><a href="https://github.com/Turbo87/sidebar-v2" role="tab" target="_blank"><i className="fa fa-github"></i></a></li>
            </ul>

            <ul role="tablist">
              <li><a href="#settings" role="tab"><i className="fa fa-gear"></i></a></li>
            </ul>
          </div>

          <div className="sidebar-content">
            <div className="sidebar-pane" id="home">
              <h1 className="sidebar-header">
              Layers
                <span className="sidebar-close"><i className="fa fa-caret-left"></i></span>
              </h1>

              <div id="layers" ref={div => this.layerswitcher = div} className="layer-switcher"></div>
            </div>

            <div className="sidebar-pane" id="profile">
              <h1 className="sidebar-header">Profile<span className="sidebar-close"><i className="fa fa-caret-left"></i></span></h1>
            </div>

            <div className="sidebar-pane" id="messages">
              <h1 className="sidebar-header">Messages<span className="sidebar-close"><i className="fa fa-caret-left"></i></span></h1>
            </div>

            <div className="sidebar-pane" id="settings">
              <h1 className="sidebar-header">Settings<span className="sidebar-close"><i className="fa fa-caret-left"></i></span></h1>
            </div>
          </div>
        </div>
        <SelectK />
        <SliderDates />      
        <div className='h-100 sidebar-map' id='map' ref={div => this.olmap = div}></div>
        <div id='sliderDiv' className='ol-control slider-bar' ref={div => this.sliderDiv = div}></div>
{/**
        <div id="popup" className="ol-popup">
          <a href="#" id="popup-closer" className="ol-popup-closer"></a>
          <div id="popup-content"></div>
        </div>
*/}        
        </div>
    )
  }
}

export default connect(reduxState => reduxState, { getDispatch, initRawsData, selectK, setMonths })(IconMap)
        // <SliderDates className='rotate-north ol-unselectable ol-control slider-bar' />
        // <div className="rotate-north ol-unselectable ol-control slider-bar" id="sliderDiv" ref={div => this.sliderBar = div}></div>