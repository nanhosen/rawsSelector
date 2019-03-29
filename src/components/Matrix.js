// import React, { Component } from 'react'
// import { connect } from 'react-redux'
// import { ResponsiveHeatMapCanvas } from '@nivo/heatmap'
// import { correls } from '../data/correls'

// class Matrix extends Component {
//  constructor(props) {
//    super(props)
//     console.log(props.raws)
//     let data
//     let dispatch = String(props.dispatchArea)
//     if (correls[dispatch] === undefined) {
//       data = correls['IDSCC']
//     }
//     else {
//       data = correls[dispatch].map(batch => {
//         var row = {}
//         for (let id in batch) {
//           if (id === 'raws') {
//             row['raws'] = props.raws.filter(x => batch[id] == x.id)[0]['name']
//           }
//           else{
//             let name = props.raws.filter(x => parseInt(x.id) == parseInt(id))[0]['name']
//             row[name] = batch[id]
//           }
//         }
//         return row
//       })
//     }    
//    this.state = { data }
//  }

//   componentDidUpdate(prevProps) {
//     console.log('prevProps: ', prevProps)
//     console.log('this.props: ', this.props)
//     if (prevProps !== this.props) {
//       let dispatch = String(this.props.dispatchArea)
//       if (correls[dispatch] === undefined) {
//         let data = correls['IDSCC']
//         this.setState({ data })
//       }
//       else {
//         let data = correls[dispatch].map(batch => {
//           let row = {}
//           for (let id in batch) {
//             if (id === 'raws') {
//               // console.log(!this.props.initData.selectedRaws.filter(x => batch[id] == x.id)[0] ? false : this.props.initData.selectedRaws.filter(x => batch[id] == x.id)[0].name)
//               row['raws'] = !this.props.initData.selectedRaws.filter(x => batch[id] == x.id)[0] 
//                 ? '' 
//                 : this.props.initData.selectedRaws.filter(x => batch[id] == x.id)[0].name;
//             }
//             else{
//               let name = !this.props.initData.selectedRaws.filter(x => parseInt(x.id) == parseInt(id))[0]
//                 ? ''
//                 : this.props.initData.selectedRaws.filter(x => parseInt(x.id) == parseInt(id))[0].name
//               row[name] = batch[id]
//             }
//             return row
//           }
//         })
//       this.setState = { data: data }
//       }
//     }
//   }

//  render() {
//     if (this.props.initData.selectedRaws.length === 0) { 
//      return (
//         <div className="card border-0" style={{backgroundColor: '#a4a9aa', height: `${this.props.parentHeight}px`}}>
//         </div>
//       )  
//     }  
//     return (
//      <ResponsiveHeatMapCanvas
//         data={this.state.data}
//          keys={Object.keys(this.state.data[0]).slice(0,-1)}
//         indexBy="raws"
//         margin={{
//           "top": 100,
//           "right": 5,
//           "bottom": 60,
//           "left": 60
//         }}
//         pixelRatio={1.5}
//         minValue="auto"
//         maxValue="auto"
//         forceSquare={false}
//         sizeVariation={0.5}
//         padding={0}
//         // colors="OrRd"
//         // colors={['#f44336', '#ff9800', '#ffc107', '#8bc34a']}
//         colors={['#f44336', '#fe510c', '#ff48c4', '#6fff00']}
//         axisTop={{
//           "orient": "top",
//           "tickSize": 0,
//           "tickPadding": 10,
//           "tickRotation": 45,
//           // "legend": "",
//           // "legendOffset": 36
//         }}
//         axisLeft={{
//           "orient": "left",
//           "tickSize": 0,
//           "tickPadding": 0,
//           "tickRotation": 45,
//           // "legend": "raws",
//           // "legendPosition": "center",
//           // "legendOffset": -40
//         }}
//         enableGridX={true}
//         enableGridY={true}
//         cellShape="circle"
//         cellOpacity={1}
//         cellBorderWidth={0}
//         cellBorderColor="inherit:darker(0.4)"
//         enableLabels={true}
//         // labelTextColor="#ffffff"
//         labelTextColor="black"
//         animate={true}
//         motionStiffness={120}
//         motionDamping={9}
//         isInteractive={true}
//         hoverTarget="rowColumn"
//         cellHoverOpacity={1}
//         cellHoverOthersOpacity={0.5}
//      />  
//    )
//   }
// }

// const mapStateToProps = state => {
//  const { raws, dispatchArea } = state
//  return { raws, dispatchArea }
// }

// export default connect(mapStateToProps, null)(Matrix)

import React, { Component } from 'react'
import * as jz from 'jeezy'
import { connect } from 'react-redux'
import { ResponsiveHeatMapCanvas } from '@nivo/heatmap'
import { correls } from '../data/correls'
import monthlyErcs from '../data/monthlyErcs' 

let dispatch

class Matrix extends Component {
  constructor(props) {
    super(props)
    this.state = { rawsNames: null }
  }

  isDispatch()  {
    dispatch = String(this.props.dispatchArea)
    // if (correls[dispatch] === undefined){
    //   return correls['IDSCC']
    // }
    // else {
      var data = [];
      var cols = "abcdefghijklmnopqrstuvwxyz".split("");
      for (var i = 0; i <= 30; i++){
        var obj = {index: i};
        cols.forEach(col => {
          obj[col] = jz.num.randBetween(1, 100);
        });
        data.push(obj);
      }
      var selectedErcData = this.props.initData.stnErcData
      var stns = Object.keys(selectedErcData[0])
      stns.pop()
      var corr = jz.arr.correlationMatrix(data, cols);
      var corr1 = jz.arr.correlationMatrix(selectedErcData, stns);
      var calculatedMatrixData = []
      // console.log(stns, 'stns')
      stns.map(currStn => 
        {
          var currObj = {}
          var currStnName = this.props.initData.nameMap.get(currStn)
          currObj = {
            'raws': currStnName
          }
          corr1.map(curr => {
            if(curr.column_x == currStn){
              var corrStnName = this.props.initData.nameMap.get(curr.column_y)
              currObj[corrStnName] = curr.correlation.toFixed(3)
              // console.log(curr.column_x, currStn)
            }
          })

          // console.log(curr.column_x, curr.column_y, currStn)
          calculatedMatrixData.push(currObj)
          // currObj[]
        }
      )
      // console.log('this', this)
      // console.log( 'corr1', corr1)
      // console.log(calculatedMatrixData, 'calcData')
      // var a = correls[dispatch][0]
      // var array = [10,20,40,45,60,65,75,80,10,20,40,45,60,65,75,80,10,20,40,45,60,65,75,80]
      // console.log(jz.arr.average(array))
      // var newArray = []
      // var b = correls[dispatch]

      // b.map(a => {
      //   var makeObj = {}
      //   for (var prop in a) {
      //     var propString = prop.toString()
      //     if (propString === 'raws') {
      //       var rawsPartId = a['raws']
      //       var rawsPartIdString = rawsPartId.toString()
      //       // makeObj['raws'] = this.props.initData.nameMap.get(parseInt(a['raws']))
      //       makeObj['raws'] = this.props.initData.nameMap.get(rawsPartIdString)
      //     }
      //     else{
      //       var c = this.props.initData.nameMap.get(propString)
      //       makeObj[c] = a[prop]
      //     }
      //   }
      //   newArray.push(makeObj)
      // })
      // console.log('newArray', newArray)
      return calculatedMatrixData
    // }
  }
  render() {
    console.log(this.props.initData.selectedRaws, 'selectedRaws')

    if (this.props.initData.selectedRaws === undefined) { 
      console.log(this)
     return (
        <div className="card border-0" style={{backgroundColor: '#a4a9aa', height: `${this.props.parentHeight}px`}}>
        </div>
      )  
    } 
    const { raws, ...noRaws } = this.isDispatch()[0]
    console.log(raws, noRaws, this.isDispatch()[0])
    return (
      <ResponsiveHeatMapCanvas
        data={this.isDispatch()}
        keys={Object.keys(noRaws)}
        indexBy="raws"
        margin={{
          "top": 100,
          "right": 5,
          "bottom": 60,
          "left": 60
        }}
        pixelRatio={1.5}
        minValue="auto"
        maxValue="auto"
        forceSquare={true}
        // sizeVariation={0.5}
        padding={0}
        // colors="OrRd"
        // colors={['#f44336', '#ff9800', '#ffc107', '#8bc34a']}
        colors={['#f44336','#F44336', '#F45432', '#F5662E','#F6762B', '#F79226', '#F8B020', '#F9D01B', '#FAF216', '#C1FC0B', '#A7FD08','#6fff00']}
        axisTop={{
          "orient": "top",
          "tickSize": 0,
          "tickPadding": 10,
          "tickRotation": 45,
          // "legend": "",
          // "legendOffset": 36
        }}
        axisLeft={{
          "orient": "left",
          "tickSize": 0,
          "tickPadding": 10,
          "tickRotation": 45,
          // "legend": "raws",
          // "legendPosition": "center",
          // "legendOffset": -40
        }}
        enableGridX={true}
        enableGridY={true}
        // cellSha0pe="circle"
        cellOpacity={1}
        cellBorderWidth={0}
        cellBorderColor="inherit:darker(0.4)"
        enableLabels={true}
        // labelTextColor="#ffffff"
        labelTextColor="black"
        animate={true}
        motionStiffness={120}
        motionDamping={9}
        isInteractive={true}
        hoverTarget="rowColumn"
        cellHoverOpacity={1}
        cellHoverOthersOpacity={0.5}
      />  
    )
  }

}

const mapStateToProps = state => {
  const {raws, dispatchArea, initData} = state
  console.log(state, 'state')
  return {raws, dispatchArea, initData}
}
export default connect(mapStateToProps, null)(Matrix)