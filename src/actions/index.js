import monthlyErcs from '../data/monthlyErcs'
import { calculatePca } from '../components/stats/calculatePca'
import { kMeansCluster, getClusterColors } from '../components/stats/kMeansCluster'

import { SELECTED_DISPATCH, K_VALUE, MONTHLY_ERC, SET_MONTHS, INIT_RAWS_DATA } from './types'

export function initRawsData(selectedRaws, monthRange = [0, 11], k = 1) {
  if (!arguments.length) { return { type: INIT_RAWS_DATA, payload: {} } }
  var rawsIds = selectedRaws.map(x => x.id)
  var stnErcData = []
  var filteredDate = monthlyErcs.filter((curr,i) => (i>=monthRange[0] && i<=monthRange[1]) )
  filteredDate.map((curr1,i) => {
   var ercObj = {}
   rawsIds.map(curr=>{
     if(curr1[curr]!= undefined) {
       ercObj[curr] = curr1[curr]
      }
    })
    ercObj["Month"] = curr1["Month"]
    stnErcData.push(ercObj)
  })

  let nameMap = new Map()
  selectedRaws.forEach(raw => {
    let { id, name } = raw
    nameMap.set(id, name)
  })
  console.log(selectedRaws, Object.keys(stnErcData[0]).length)
  var payload = {}

  if( Object.keys(stnErcData[0]).length<2){
    console.log('less than 2')
    // var calculatedPca = undefined
    // var kMeansGroups = undefined
    // var colorMap = undefined
    payload = {}
  }
  else{
    var calculatedPca = calculatePca(selectedRaws, monthRange)
    var kMeansGroups = kMeansCluster(calculatedPca, k)
    var colorMap = getClusterColors(kMeansGroups.stnPosition)
    payload = { selectedRaws, stnErcData, rawsIds, kMeansGroups, colorMap, calculatedPca, nameMap }
  }

  return {
    type: INIT_RAWS_DATA,
    payload
  }
}

export function getDispatch(selectedDispatch) {
  const payload = selectedDispatch
  return {
    type: SELECTED_DISPATCH,
    payload
  }
}

export function selectK(k) {
  const payload = parseInt(k)
  return {
    type: K_VALUE,
    payload
  }
}

export function setMonths(months) {
  const payload = months
  console.log('months payload', months)
  return {
    type: SET_MONTHS,
    payload
  }
}
