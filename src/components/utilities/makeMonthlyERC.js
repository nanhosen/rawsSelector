import monthlyErcs from '../../data/monthlyErcs' 
export function makeMonthlyERC(selectedRaws, months) {
	var newErcThing = []
  var filteredDate = monthlyErcs.filter((curr,i) => (i>=months[0] && i<=months[1]) )
  filteredDate.map((curr1,i) => {
   var ercObj = {}
   selectedRaws.map(x => x.id).map(curr=>{
     if(curr1[curr]!= undefined){
       ercObj[curr] = curr1[curr]
      }
    })
    ercObj["Month"] = curr1["Month"]
    newErcThing.push(ercObj)
  })
  return newErcThing
}