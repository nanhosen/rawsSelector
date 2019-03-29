import 'rc-slider/assets/index.css'
import 'rc-tooltip/assets/bootstrap.css'
import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import { initMap, setMonths } from '../actions'
import Tooltip from 'rc-tooltip'
import Slider from 'rc-slider'


const monthRange = { 0: 'January', 1: 'February', 2: 'March', 3: 'April', 4: 'May', 5: 'June', 6: 'July', 7: 'August', 8: 'September', 9: 'October', 10: 'November', 11: 'December' }
// const monthRange = { 11: 'December', 10: 'November', 9: 'October', 8: 'September', 7: 'August', 6: 'July', 5: 'June', 4: 'May', 3: 'April', 2: 'March', 1: 'February', 0: 'January' }
// const marks = { 11: 'Dec', 10: 'Nov', 9: 'Oct', 8: 'Sep', 7: 'Aug', 6: 'Jul', 5: 'Jun', 4: 'May', 3: 'Apr', 2: 'Mar', 1: 'Feb', 0: 'Jan' }  
const marks = { 0: 'Jan', 1: 'Feb', 2: 'Mar', 3: 'Apr', 4: 'May', 5: 'Jun', 6: 'Jul', 7: 'Aug', 8: 'Sep', 9: 'Oct', 10: 'Nov', 11: 'Dec' }  
const createSliderWithTooltip = Slider.createSliderWithTooltip
const Range = createSliderWithTooltip(Slider.Range)
// const Range = Slider.Range
const Handle = Slider.Handle

class SliderDates extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: [0, 11],
    }
  }


  handleChange = value => {
  	console.log('value', value)
    this.setState({ value })
    console.log(this.state.value)
    this.props.setMonths(value)
  }

  componentDidUpdate = prevProps => {
  	if(prevProps.monthRange != this.props.monthRange) {
  		this.setState({ value: this.props.monthRange })
  	}
  } 

  render() {
	  if (this.props.initData.selectedRaws !== undefined) {
	  	var rangeElement = <Range 
	  		vertical
	  		marks = {marks}
	    	// disabled = {true}
	    	allowCross = {false}
	    	min = {0}
	    	max = {11}
	    	step = {1}
	    	defaultValue={[0, 11]}
	    	pushable={1}
	    	// value = {this.state.value}
	    	onChange = {value => this.handleChange(value)}
	    	tipFormatter = {value => marks[`${value}`]} 
	    />
			return (
				ReactDOM.createPortal(
					rangeElement,
			    document.getElementById('sliderDiv')
			  )
			)
	  }
	  else{
	  	return (
	  		<div></div>
			)
	  }
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
