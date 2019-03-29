import * as PCA from 'pca-js'
import monthlyErcs from '../../data/monthlyErcs' 

export function calculatePca(selectedRaws, monthRange) {
	const monthlyErcData = (function makeMonthlyERC(selectedRaws, monthRange) {
		var newErcArray = []
	  var filteredDate = monthlyErcs.filter((curr, i) => (i >= monthRange[0] && i <= monthRange[1]))
	  filteredDate.map((curr1,i) => {
	  	var ercObj = {}
	   	selectedRaws.map(x => x.id).map(curr=> {
	    	if(curr1[curr]!= undefined){
	      	ercObj[curr] = curr1[curr]
	      }
	    })
	    ercObj["Month"] = curr1["Month"]
	    newErcArray.push(ercObj)
	  })
	  return newErcArray
	})(selectedRaws, monthRange)


	function standardDeviation(values) {
	  var avg = average(values)
	  
	  var squareDiffs = values.map(function(value){
	    var diff = value - avg
	    var sqrDiff = diff * diff
	    return sqrDiff
  	})
  
  	var avgSquareDiff = average(squareDiffs)
	  var stdDev = Math.sqrt(avgSquareDiff)
	  return stdDev
	}
 
	function average(data){
	  var sum = data.reduce(function(sum, value){
	    return sum + value
	  }, 0)
	 
	  var avg = sum / data.length
	  return avg
	}

	var rawsOrder = Object.keys(monthlyErcData[0]).slice(0,-1)
	var X = []
	var n = 0
	while(n < rawsOrder.length) {
		X.push([])
		n++
	}
	var monthlyStandMap = new Map()
	var noMonthERCs = [] //only ERCs, no ID and no Month. Input to cluster function
  var monthlyErcStns = Object.keys(monthlyErcData[0]).slice(0,-1)
  var noMonthData = monthlyErcData.map((curr,i) => {
  	var monthAr = []
  	for (var val in curr){
  		if(val !== 'Month'){	
  			monthAr.push(curr[val])
  		}
  	}
  	var monthStDev = standardDeviation(monthAr)
  	var monthMean = average(monthAr)
  	monthlyStandMap.set(i, [monthStDev, monthMean])
  })


	rawsOrder.map((stnId,i) => {
		monthlyErcData.map((curr,j) => {
			var currStandMean = monthlyStandMap.get(j)
			var standardized = (curr[stnId] - currStandMean[1]) / currStandMean[0]
			X[i].push(standardized)
		})
	})
	// console.log('x', X)
	var vectors = PCA.getEigenVectors(X)
	var first = PCA.computePercentageExplained(vectors,vectors[0])
	var topTwo =  PCA.computePercentageExplained(vectors,vectors[0],vectors[1])
	var pc1 = PCA.computeAdjustedData(X,vectors[0])
	var pc2 = PCA.computeAdjustedData(X,vectors[1])

	var data1 = []
	pc1.adjustedData[0].map((curr,i) => {
		data1.push([curr,pc2.adjustedData[0][i]])
	})

	const pcaInfo = {
		rawsOrder,
		pc1: pc1.adjustedData,
		pc2: pc2.adjustedData,
		stnPCA: data1
	}
	return pcaInfo
} 
