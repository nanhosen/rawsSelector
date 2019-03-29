import React, { Component } from 'react'
import Plot from 'react-plotly.js'
import { connect } from 'react-redux'
// import cluster from 'hierarchical-clustering'
// import {
//   LineChart, 
//   Line, 
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip, 
//   Legend,
//   RadarChart, 
//   ResponsiveContainer} from 'recharts'
// import monthlyErcs from '../data/monthlyErcs'



class Chart extends Component {
  constructor(props) {
    super(props)
    this.state = { }
  }
  componentDidUpdate() {
    // this.chartData()

  // console.log(this.props,'props')
  // this.setState({ raws: }) this.props.raws
  // console.log(correls[this.props.dispatchArea])
  // console.log(correls["IDSCC"],'correls')
  }
  componentDidMount() {}
  // https://github.com/plotly/react-plotly.js/
  chartData() {
    var dataArray = []
    // console.log(this.props)
    var dataIds = this.props.initData.stnErcData
    var idArray = Object.keys(dataIds[0])
    var plotlyData = []
    idArray.map(curr => {
      var currId = curr
      var pushObj = {}
      var lineCol = this.props.initData.colorMap.get(currId)
      pushObj.x = []
      pushObj.y = []
      pushObj.type = 'scatter'
      pushObj.showlegend = false
      pushObj.mode = 'lines'
      pushObj.line = {
        'shape': 'spline', 
        'smoothing': 5,
        'color': lineCol,
        'width': 3
      } 
      dataIds.map(curr1 => {
        for (var id in curr1){
          if(id == currId){
            pushObj.x.push(curr1.Month)
            var stnName = this.props.initData.nameMap.get(id)
            pushObj.name = stnName
            pushObj.y.push(curr1[id])
          }
        }
      })
      plotlyData.push(pushObj)
    })
    // console.log(plotlyData)
    return plotlyData
  }

  // https://github.com/plotly/plotly.js/pull/2200 (original polar 1.0 pull request)
  // https://github.com/plotly/plotly.js/issues/2255 (polar 2.0 pull request)
  // https://github.com/plotly/plotly.js/issues/3073  (connectends attr)
  // chartData() {
  //   var dataArray = []
  //   var dataIds = this.props.monthlyErc
  //   var idArray = Object.keys(dataIds[0])
  //   var plotlyData = []
  //   idArray.map(curr => {
  //     var currId = curr
  //     var pushObj = {}
  //     var lineCol = this.props.clusters.get(currId)
  //     pushObj.r = []
  //     pushObj.theta =  []
  //     pushObj.fill = 'toself'
  //     pushObj.type = 'scatterpolar'
  //     pushObj.showlegend = false
  //     dataIds.map(curr1 => {
  //       for (var id in curr1){
  //         if(id == currId){
  //           pushObj.r.push(curr1[id])
  //           var stnName = this.props.names.get(id)
  //           pushObj.name = stnName
  //           pushObj.theta.push(curr1.Month)
  //         }
  //       }
  //     })
  //     // pushObj.type = 'scatter'
  //     // pushObj.showlegend = false
  //     pushObj.mode = 'lines'
  //     pushObj.line = {
  //       'shape': 'spline', 
  //       'smoothing': 5,
  //       'color': lineCol,
  //       'width': 2
  //     } 
  //     // dataIds.map(curr1 => {
  //     //   for (var id in curr1){
  //     //     if(id == currId){
  //     //       pushObj.x.push(curr1.Month)
  //     //       var stnName = this.props.names.get(id)
  //     //       pushObj.name = stnName
  //     //       pushObj.y.push(curr1[id])
  //     //     }
  //     //   }
  //     // })
  //     plotlyData.push(pushObj)
  //   })
  //   console.log(plotlyData)
  //   return plotlyData
  // }

  render() {

    if (this.props.initData.selectedRaws === undefined ) { 
     return (
        <div className="card border-0" style={{ backgroundColor: '#a4a9aa', height: `${this.props.parentHeight}px`}}>
        </div>
      )  
    }
    else{
      const computedData = this.chartData()
      return (
        <Plot
          className="h-100 w-100"
          data={computedData}
          onAfterPlot={e => {
            var dragLayer = document.getElementsByClassName('nsewdrag')[0]
            dragLayer.style.cursor = 'crosshair'
          }}
          onHover={e => {
            var dragLayer = document.getElementsByClassName('nsewdrag')[0]
            dragLayer.style.cursor = 'default'
          }}
          onUnhover={e => {
            var dragLayer = document.getElementsByClassName('nsewdrag')[0]
            dragLayer.style.cursor = 'crosshair'
          }}
          layout={{
            // title: 'RAWS Station Monthly Mean ERC Values',
            // connectgaps: true,
            // paper_bgcolor: 'rgba(109, 109, 109, .8)',
            // plot_bgcolor: "#4080bf",
            // autosize: true,
            // polar: {
            //   radialaxis: {
            //     fixedrange: false,
            //     visible: true,
            //     range: [0, 80]
            //   }
            // },            
            title: 'RAWS Station Monthly Mean ERC Values',
            plot_bgcolor: 'rgba(109, 109, 109, .8)',
            autosize: true,
            xaxis: { 
              fixedrange: false,
              title: 'Month',
              showspikes: true,
              rangeslider: {}
            },
            yaxis: { 
              fixedrange: false,
              title: 'Mean ERC',
              showspikes: true
            },
            dragmode: 'pan',
            hovermode: 'closest',
          }}
          useResizeHandler={true}
          config={{
            scrollZoom: true,
            editable: false,
            displaylogo: false,
            modeBarButtonsToRemove: ['sendDataToCloud'],
            // See https://github.com/plotly/plotly.js/blob/master/src/components/modebar/buttons.js
            // for a list of buttons
          }}
        />
      );
    }
  }
}



const mapStateToProps = state => {
  // const {raws, dispatchArea, rawsNames} = state
  // console.log(state)
  // return {raws, dispatchArea, rawsNames}
  return state
}
export default connect(mapStateToProps, null)(Chart)