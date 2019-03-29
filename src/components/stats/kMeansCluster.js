import * as mlk from 'ml-kmeans'

export function getClusterColors(clusters) {
  var colorAr = ['#fb45d2', '#ffc007', '#00bbff', '#ff0808', '#64ff2e', '#001eff', '#fff906', '#fd0256', '#fff906', '#F99379', '#604E97', '#F6A600', '#B3446C', '#DCD300', '#882D17', '#8DB600', '#654522', '#E25822', '#2B3D26', '#F2F3F4', '#222222', '#F3C300']
  var clusterColorMap = new Map()
  clusters.map((cluster,index)=> {
    var color = colorAr[index]
    cluster.map((station,ind) => {
      clusterColorMap.set(station,color)
    })
  })
  return clusterColorMap
}

export function kMeansCluster(pcaData, K) {
	let k1 = parseInt(K)
	var kMeansObj = {}
	var stnSilValMap = new Map()
	var avgSilValMap = new Map()
	var stnColorMap = new Map()
	var stnOrderMap = new Map()
	var stnSilScore2Array = []
	var stnColorArray = []
	var stnOrderArray = []
	var stnDataObjects = []

	let stnOrder1
	stnOrder1 = pcaData.rawsOrder
	var counter = 1
	var kValArray = []
	while (counter <= stnOrder1.length){
		kValArray.push(counter)
		counter ++
	}
	let ans1
	ans1 = mlk.default(pcaData.stnPCA, k1, {seed: 42});

	var posMap = new Map()
	var stnPosition1 = []
	let i = 0
	while ( i < k1 ) {
		stnPosition1[i]=[]
		i++
	}


	ans1.clusters.map((curr,i)=>{
		stnPosition1[curr].push(stnOrder1[i].toString())
	})
		kMeansObj["stnPosition"] = stnPosition1

		kValArray.map(currK => {
			let k = parseInt(currK)
			let stnOrder
			stnOrder = pcaData.rawsOrder
			let ans
			ans = mlk.default(pcaData.stnPCA, k, {seed: 42});

			var stnPosition = []
			let i = 0
			while ( i < k ) {
				stnPosition[i]=[]
				i++
			}


			ans.clusters.map((curr,i)=>{
				stnPosition[curr].push(stnOrder[i].toString())
			})

			var indices = ans.clusters
			var ref = indices.map((x,i) => {
				return { 
					raws: stnOrder[i],
					index: x,
					coords: pcaData.stnPCA[i]
				}
			})

			function L2(p, p2) {
			  let xdiff = Math.pow((p[0] - p2[0]), 2)
			  let ydiff = Math.pow((p[1] - p2[1]), 2)
			 return Math.sqrt( xdiff + ydiff )
			}

			var allBatches = []	
			var wca = [].concat(...(function getWCAverages(ref) {
				var CI = [...(new Set(indices))]
				var batches = CI.map(index => {
					return ref.filter(entry => entry.index === index)
				})
				var wca = batches.map((batch,i) => {
					var arr = []
					batch.map(currBatch => allBatches.push(currBatch))
					for (let raws of batch) {
						// console.log('raws of batch', raws.raws, 'batch', batch[i])
						arr.push(batch.map(neighbor => {
							// console.log('batch', batch, 'neighbor', neighbor)
							return L2(raws.coords, neighbor.coords)
						}))
					}
					return arr.map(x => {
						if (batch.length === 1) { return 0 } 
						return x.reduce((prev, curr) => {
					  	return (parseFloat(curr) + prev)
					  }, 0) / (x.length - 1)
					  // since we don't count the 0 distance between the point and itself
					})
				})
				return wca
			}(ref))) 

			var oca = [].concat(...(function getOCAverages(ref) {
				var CI = [...(new Set(indices))]
				var batches = CI.map(index => {
					return ref.filter(entry => entry.index === index)
				})
				var oca = batches.map(batch => {
					var arr = []
					for (let raws of batch) {
						arr.push(batches.map(neighborCluster => {
								return neighborCluster.map(neighbor => {
									return L2(raws.coords, neighbor.coords)
								})
							})
						)
					}
					return arr.map(x => {
						return x.map(curr => {
							return curr.reduce((prev, curr) => {
								return (parseFloat(curr) + prev)
							}, 0) / (curr.length)
						}).sort((a, b) => a - b).slice(1,3).slice(0,1)
					})
				})
				return oca
			}(ref)))
			// console.log('oca', oca)

			var unsortsil = oca.map((b, i) => {
				return (b - wca[i]) / Math.max(b, wca[i])
			})

  		var colorAr  = ['#875692', '#F38400', '#A1CAF1', '#BE0032', '#C2B280', '#848482', '#008856', '#E68FAC', '#0067A5', '#F99379', '#604E97', '#F6A600', '#B3446C', '#DCD300', '#882D17', '#8DB600', '#654522', '#E25822', '#2B3D26', '#F2F3F4', '#222222', '#F3C300']
  		var stnColor = []
  		var stnOrderArray1 = []
  		var stnSilScore2 = []
			var stnDataWithSil = allBatches.map((curr,i)=>{
				curr.silScore = unsortsil[i]
				curr.silColor = colorAr[curr.index]
				stnColor.push(colorAr[curr.index])
				stnOrderArray1.push(curr.raws)
				stnSilScore2.push(unsortsil[i])
				return curr
			})

			var sil = unsortsil.sort(function(a,b){ //Array now becomes [7, 8, 25, 41]
			  return a - b
			})
			
			var avgSil = sil.reduce((p, c) => p + c) / sil.length
			var stnSilScore2Sort = stnSilScore2.sort(function(a,b){ //Array now becomes [7, 8, 25, 41]
			  return a - b
			})
      stnSilValMap.set(k,sil)
      avgSilValMap.set(k,avgSil)
      stnColorMap.set(k,stnColor)
      stnOrderMap.set(k,stnOrderArray1)

      stnSilScore2Array.push(stnSilScore2Sort)
			stnColorArray.push(stnColor)
			stnOrderArray.push(stnOrderArray1)
			stnDataObjects.push(stnDataWithSil)
			
			kMeansObj["stnSilValMap"] = stnSilValMap
			kMeansObj["avgSilValMap"] = avgSilValMap
			kMeansObj["stnDataWithSil"] = stnDataObjects
			return kMeansObj
		})
	return kMeansObj
}