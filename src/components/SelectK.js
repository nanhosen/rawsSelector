import React, { Component } from 'react'
import ReactDOM from 'react-dom';

import { connect } from 'react-redux'
// import { Field, reduxForm, formValueSelector } from 'redux-form'
import { selectK } from '../actions' 
class SelectK extends Component {
  constructor(props) {
    super(props)
    this.state = { value: undefined }
  }

  handleChange = e => {
  	this.props.selectK(parseInt(e.target.value))
    this.setState({value: parseInt(e.target.value)})
  }

  componentDidUpdate(prevProps){
  	if(prevProps.kValue != this.props.kValue){
  		this.setState({ value: this.props.kValue })
  	}
  }
	render() {
	  if (this.props.initData.selectedRaws !== undefined){
	  	const numberOfRaws = []
		  const length = this.props.initData.selectedRaws.length > 0 ? this.props.initData.selectedRaws.length : 1
		  let n = 1
		  while (n <= length){
		  	numberOfRaws.push(n)
		  	n++
		  }
		      //<form>
	        //   <select value={this.state.value} onChange={this.handleChange}>
					    // {numberOfRaws.map(n => (
		       //      <option value={n} key={n}>
		       //        {n}
		       //      </option>
		       //    ))}
	        //   </select>
		      // </form>		
		    var form1 = <form><select value={this.state.value} onChange={this.handleChange}>{numberOfRaws.map(n => (<option value={n} key={n}>{n}</option>))}</select></form>
				return (
					ReactDOM.createPortal(
				    form1,
				    document.getElementById('selectKDiv')
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

const mapStateToProps = reduxState => {
  return reduxState
}

export default connect(mapStateToProps, { selectK })(SelectK)

