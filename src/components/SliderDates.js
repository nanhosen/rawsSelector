import 'rc-slider/assets/index.css'
import 'rc-tooltip/assets/bootstrap.css'
import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import { initMap, setMonths } from '../actions'
import Tooltip from 'rc-tooltip'
import Slider from 'rc-slider'


const monthRange = { 0: 'January', 1: 'February', 2: 'March', 3: 'April', 4: 'May', 5: 'June', 6: 'July', 7: 'August', 8: 'September', 9: 'October', 10: 'November', 11: 'December' } 
const createSliderWithTooltip = Slider.createSliderWithTooltip
const Range = createSliderWithTooltip(Slider.Range)
const Handle = Slider.Handle

class SliderDates extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: [0, 11],
    }
  }
  componentDidUpdate = prevProps => {
  	this.props.setMonths(this.state.value)
  } 

	render() {
		var rangeRender = <Range 
    	// disabled = {true}
    	allowCross = {false}
    	min = {0}
    	max = {11}
    	step = {1}
    	defaultValue={[0, 11]}
    	pushable={1}
    	// value = {this.state.value}
    	onChange = {value => this.setState({ value })}
    	tipFormatter = {value => monthRange[`${value}`]} 
    />	
		return (
      rangeRender
    )
  }
}

// const mapDispatchToProps = dispatch => bindActionCreators({ setMonths }, dispatch)
// const mapStateToProps = state => state
const mapStateToProps = reduxState => {
  return reduxState
}
export default connect(mapStateToProps, { setMonths })(SliderDates)
				        // <label>LowerBound: </label>
				        // <input type="month" value={this.state.lowerBound} onChange={this.onLowerBoundChange} />
				        // <br />
				        // <label>UpperBound: </label>
				        // <input type="month" value={this.state.upperBound} onChange={this.onUpperBoundChange} />
				        // <br />
				        // <button onClick={this.handleApply}>Apply</button>
				        // <br /><br />
				        // <Range 
				        // 	allowCross={false}
				        // 	value={this.state.value}
				        // 	onChange={this.onSliderChange}
				        // 	step={10}
				        // />

// if (document.getElementById('sliderDiv')==null){
//       console.log('IM NULL!!!')
//       return (
//         rangeRender
//         // this.props.sliderDiv.sliderBar
//       )
//     }
//     if (document.getElementById('sliderDiv') !== null) {
//       console.log('IM NOT NULLL@@@!!')
//       return (
//         ReactDOM.createPortal(
//           rangeRender,
//           document.getElementById('sliderDiv')
//         )
//       )
//     }
