import 'rc-slider/assets/index.css'
import 'rc-tooltip/assets/bootstrap.css'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { initMap, setMonths } from '../actions'
import SelectK from './SelectK'
// import SelectKDates from './SelectKDates'
// import SliderDates from './SliderDates1'
import Tooltip from 'rc-tooltip'
import Slider from 'rc-slider'


// const monthRange = { 0: 'January', 1: 'February', 2: 'March', 3: 'April', 4: 'May', 5: 'June', 6: 'July', 7: 'August', 8: 'September', 9: 'October', 10: 'November', 11: 'December' } 
// const createSliderWithTooltip = Slider.createSliderWithTooltip
// const Range = createSliderWithTooltip(Slider.Range)
// // const Range = Slider.Range
// const Handle = Slider.Handle


// const handle = props => {
//   const { value, dragging, index, ...restProps } = props;
//   return (
//     <Tooltip
//       prefixCls="rc-slider-tooltip"
//       overlay={value}
//       visible={dragging}
//       placement="top"
//       key={index}
//     >
//       <Handle value={value} {...restProps} />
//     </Tooltip>
//   )
// }

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: [0, 11],
    }
  }


  componentDidUpdate = prevProps => {
  	// console.log(this.state)
  	// this.props.setMonths(this.state.value)
  } 
	render() {
		return (
			<nav 
				className="navbar navbar-toggleable-sm navbar-light bg-faded"
				style={{height: '25%', backgroundImage: `url('raws_banner1.png')`, backgroundSize: '100% 100%'}} 
				// style={{backgroundColor: '#292b2c'}} 
				// style={{backgroundColor: '#6fff00'}}
				// style={{backgroundColor: '#ff48c4'}}
			>
			  <a className="btn btn-outline-light" href="https://gacc.nifc.gov/gbcc/predictive/Sig_Tool_Users_Guide.pdf" role="button" style={{right: '1.6em', position: 'absolute'}}>User's Guide</a>



				


			</nav>
		)
  }
}

// const mapDispatchToProps = dispatch => bindActionCreators({ setMonths }, dispatch)
// const mapStateToProps = state => state
export default connect(null, { setMonths })(Header)
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

