import React, { Component } from 'react'
import { connect } from 'react-redux'
import Chart from './Chart'
import Matrix from './Matrix'
// import Jeezy from './Jeezy'
import SilhouetteCharts from './SilhouetteCharts'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

const noSelected = () => (
  <div className="card border-0">
    <h3 className="card-header" id="header" style={{textAlign: 'center'}}>Zone Information</h3>
    <div className="card-block">
      <p className="card-text" id="history" style={{width: "100%"}}>Select a Dispatch Area on the map</p>
    </div>
  </div>
)

class Info extends Component {
  constructor(props) {
    super(props)
    console.log(props)
    this.state = { header: null, history: null, height: null }
  }
  getHeight = target => {
    if (target !== null) {
      // console.log(target[Object.keys(target)[0]])
      const name = `${target[Object.keys(target)[0]].id}`
      // const name = `${target[Object.keys(target)[0]]._currentElement.props.id}`
      const height = target.offsetHeight
      // console.log(this.state[name])
      if (this.state[name] !== height) {
        // console.log(this)
        // console.log({[name]: height})
        // this.setState({ [name]: height })
      }
      return
    }
    return    
  } 


  render() {
    return (
      <div className="card border-0" style={{backgroundColor: '#a4a9aa', height: `${this.props.parentHeight}px`}}>
        <Tabs>
          <TabList>
            <Tab>ERC Climatology Graph</Tab>
            <Tab>Correlation Matrix</Tab>
            <Tab>Silhouette Analysis</Tab>
          </TabList>

          <TabPanel>
            <div 
              style={{
                backgroundColor: '#a4a9aa', 
                height: `${this.props.parentHeight - 38}px`
              }}
            >
              <Chart />
            </div>
          </TabPanel>
          <TabPanel>
            <div 
              style={{
                backgroundColor: '#a4a9aa', 
                height: `${this.props.parentHeight - 38}px`
              }}
            >                
              <Matrix />
            </div>
          </TabPanel>
          <TabPanel>
            <div 
              style={{
                backgroundColor: '#a4a9aa', 
                height: `${this.props.parentHeight - 38}px`
              }}
            >                
              <SilhouetteCharts />
            </div>
          </TabPanel>
        </Tabs>
      </div>        
    )
  }
}


const mapStateToProps = state => {
  const {raws, dispatchArea} = state
  return {raws, dispatchArea}
}
export default connect(mapStateToProps, null)(Info)
