import React, { Component } from 'react'
import Plot from 'react-plotly.js'
import { connect } from 'react-redux'


class SilhouetteCharts extends Component {
  state = {
    scatterX: [],
    scatterY: [],
    posAr: [],
    colorAr: [],
    pcaPoints: [],
    barX: [],
    barY: [],
    avgSilScoreY: [],
    barColorArray: [],
  } 

  componentDidMount() { 
    if (!Object.keys(this.props.initData).length) { return }
    this.pcaPlotData(this.props)
    this.barChartData(this.props)
  }
  componentDidUpdate(prevProps) {
    if (!Object.keys(this.props.initData).length) { return }
    if (prevProps.kValue !== this.props.kValue){
      this.pcaPlotData(this.props)
      this.barChartData(this.props)
    }

    if (this.props.initData !== prevProps.initData) {
      this.pcaPlotData(this.props)
      this.barChartData(this.props)
    }
  }

  pcaPlotData = props => {
    var [ scatterX, scatterY, posAr, colorAr ] = [ [], [], [], [] ]
    var pcaPoints = props.initData.calculatedPca.stnPCA
    var stnOrder = props.initData.calculatedPca.rawsOrder
    var nameMap = props.initData.nameMap
    var colorMap = props.initData.colorMap
    pcaPoints.map((curr, i) => {
      scatterX.push(curr[0])
      scatterY.push(curr[1])
      posAr.push(nameMap.get(stnOrder[i]))
      colorAr.push(colorMap.get(stnOrder[i]))
    })
    this.setState({ pcaPoints, scatterX, scatterY, posAr, colorAr })
  } 

  barChartData = props => {
    var [ barX, barY, avgSilScoreY, barColorArray ] = [ [], [], [], [] ]
    var colorAr = ['#fb45d2', '#ffc007', '#00bbff', '#ff0808', '#64ff2e', '#001eff', '#fff906', '#fd0256', '#fff906', '#F99379', '#604E97', '#F6A600', '#B3446C', '#DCD300', '#882D17', '#8DB600', '#654522', '#E25822', '#2B3D26', '#F2F3F4', '#222222', '#F3C300']
    var k = props.kValue
    var kMeansDataFromStore = props.initData.kMeansGroups
    var avgSil = kMeansDataFromStore.avgSilValMap.get(k)
    var stnDataObjs = kMeansDataFromStore.stnDataWithSil

    var thirdStnSilArr = []

    for (var position in stnDataObjs){
      var returnObj = {}
      var k1 = parseInt(position) + 1
      var indexSilAr = []
      var counter1 = 0
      while (counter1 < k1) {
        indexSilAr.push([])
        counter1 ++
      }
      var kObj = stnDataObjs[position]
      kObj.map(curr => {
        indexSilAr[curr.index].push(curr.silScore)
      })
      thirdStnSilArr.push(indexSilAr)
    }

    var sortedThirdArr = thirdStnSilArr.map((curr,i) => {
      return curr.map(curr1 => curr1.sort((a, b) => a - b))
    })
    
    var flattenedSupraArray = sortedThirdArr.map(x => {
      return [].concat(...x)
    })

    avgSilScoreY = flattenedSupraArray[0].map(curr => avgSil)

    sortedThirdArr[k-1].map((curr,i) => {
      curr.map(x => barColorArray.push(colorAr[i]))
    })

    barX = flattenedSupraArray[0].map((curr, i) => i)
    barY = flattenedSupraArray[k-1]
    this.setState({ barX, barY, avgSilScoreY, barColorArray })
  }
  
  noDataRender = () => <div className="card border-0" style={{backgroundColor: '#a4a9aa', height: `${this.props.parentHeight}px`}}></div>
  render() {
    if (!Object.keys(this.props.initData).length) { return this.noDataRender() }
    else {
      // console.log(this.state.posAr, this.state.colorAr, this.state.scatterX, this.state.scatterY)
      return (
        <div className="card border-0" style={{backgroundColor: '#a4a9aa', height: `${this.props.parentHeight}px`}}>
          <Plot
            className="h-100 w-100"
            data={[{ 
              x: this.state.scatterX,
              y: this.state.scatterY,
              text: this.state.posAr,
              mode: 'markers',
              type: 'scatter',
              marker: { 
                size: 12,
                color: this.state.colorAr 
              }
            }]}
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
            config={{
              scrollZoom: true,
              editable: false,
              displaylogo: false,
              modeBarButtonsToRemove: ['sendDataToCloud'],
            }}
            layout={{
              title: 'Dimensionality Reduction',
              plot_bgcolor: 'rgba(109, 109, 109, .9)',
              autosize: true,
              xaxis: {
                title: 'Principal Component 1',
                fixedrange: false,
                showspikes: false,
              },
              yaxis: {
                title: 'Principal Component 2',
                fixedrange: false,
                showspikes: false,
              },
              dragmode: 'pan',
              hovermode: 'closest',
            }}
          />


          <Plot
            className="h-100 w-100"
            data={[
              {
                x: this.state.barX, 
                y: this.state.barY, 
                marker: {
                  color: this.state.barColorArray,
                }, 
                type: 'bar'
              },
              {
                x: this.state.barX, 
                y: this.state.avgSilScoreY, 
                marker: { color: '#9800ff', 'width': 3 },
                mode: 'lines', 
                type: 'scatter'
              }
            ]}
            onAfterPlot={e => {
              var dragLayer = document.getElementsByClassName('nsewdrag')[1]
              dragLayer.style.cursor = 'crosshair'
            }}
            onHover={e => {
              var dragLayer = document.getElementsByClassName('nsewdrag')[1]
              dragLayer.style.cursor = 'default'
            }}
            onUnhover={e => {
              var dragLayer = document.getElementsByClassName('nsewdrag')[1]
              dragLayer.style.cursor = 'crosshair'
            }}            
            layout={{
              title: 'Silhouette Plots',
              plot_bgcolor: 'rgba(109, 109, 109, .9)',
              autosize: true,        
              xaxis: {
                title: 'Stations Grouped by Clusters',
                tickfont: {
                  size: 14, 
                  color: 'rgb(107, 107, 107)'
                }
              }, 
              yaxis: {
                title: 'Silhouette Score',
                titlefont: {
                  size: 16, 
                  color: 'rgb(107, 107, 107)'
                }, 
                tickfont: {
                  size: 14, 
                  color: "rgb(107, 107, 107)"
                }
              },
              showlegend: false, 
              barmode: 'group', 
              bargap: 0.1, 
              bargroupgap: 0.1,
              hovermode: 'closest',
              dragmode: 'pan',
            }}
            config={{
              scrollZoom: true,
              editable: false,
              displaylogo: false,
              modeBarButtonsToRemove: ['sendDataToCloud'],
            }}
          />
        </div>  
      )
    }
  }
}

const mapStateToProps = state => {
  const { initData, kValue } = state
  return { initData, kValue }
}

export default connect(mapStateToProps, null)(SilhouetteCharts)
     