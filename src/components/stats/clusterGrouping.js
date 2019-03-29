import { getLevels, getClusterById, getClusterColors } from './distanceLinkage'
import { getPCA } from './pca'
import { kMeansCluster } from './kMeansCluster'

function clusterGrouping(monthlyERCVals, minClusters, getPCAVals, getClusters, colorByCluster, rawsFeatures) {
  var levels = getLevels(monthlyERCVals, minClusters)
  var clusters = getClusterById(levels, monthlyERCVals)
  var pcaVals = getPCA(monthlyERCVals)
  getPCAVals(pcaVals)
  var kmeansGroups = kMeansCluster(pcaVals,minClusters)

  var colorMap = getClusterColors(clusters)
  getClusters(colorMap)  
  colorByCluster(this.state.rawsFeatures, colorMap)
}

export default clusterGrouping