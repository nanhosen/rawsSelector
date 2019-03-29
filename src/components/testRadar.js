  chartData() {
    var dataArray = []
    var dataIds = this.props.monthlyErc
    var idArray = Object.keys(dataIds[0])
    // console.log(idArray)
    // console.log('dataIds',dataIds)
    var plotlyData = []
    idArray.map(curr => {
      var currId = curr
      var pushObj = {}
      var lineCol = this.props.clusters.get(currId)
      pushObj.r = []
      pushObj.theta = []
      pushObj.fill = 'toself'
      pushObj.type = 'scatter'
      pushObj.showlegend = false
      dataIds.map(curr1 => {
        for (var id in curr1){
          if(id == currId){
            pushObj.r.push(curr1.Month)
            var stnName = this.props.names.get(id)
            pushObj.name = stnName
            pushObj.theta.push(curr1[id])
          }
        }
      })
      // pushObj.type = 'scatter'
      // pushObj.showlegend = false
      // pushObj.mode = 'lines'
      // pushObj.line = {
      //   'shape': 'spline', 
      //   'smoothing': 5,
      //   'color': lineCol,
      //   'width': 3
      // } 
      // dataIds.map(curr1 => {
      //   for (var id in curr1){
      //     if(id == currId){
      //       pushObj.x.push(curr1.Month)
      //       var stnName = this.props.names.get(id)
      //       pushObj.name = stnName
      //       pushObj.y.push(curr1[id])
      //     }
      //   }
      // })
      plotlyData.push(pushObj)
    })
    // console.log(plotlyData)
    return plotlyData
  }

              title: 'RAWS Station Monthly Mean ERC Values',
            plot_bgcolor: 'rgba(109, 109, 109, .8)',
            autosize: true,
            polar: {
              radialaxis: {
                visible: true,
                range: [0, 100]
              }
            },