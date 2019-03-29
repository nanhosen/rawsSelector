import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'

import Info from './Info'
import './Home.css'
import IconMap from './IconMap'

class Home extends Component {
	constructor(props) {
		super(props)
		this.state = { height: null }
	}

	getHeight = target => {
		if (target !== null) {
			const height = target.offsetHeight
			if (this.state.height != height) {
				this.setState({ height })
			}
			return
		}
		return
	}
	componentDidMount() {
		window.addEventListener("resize", () => this.getHeight(ReactDOM.findDOMNode(this).firstChild))
	}

  componentWillUnmount() {
    window.removeEventListener("resize", () => this.getHeight(ReactDOM.findDOMNode(this).firstChild))
  }

	render(){
		return(
			<div className="row mx-2 h-100">

   			<div className="mt-4 col-12 col-md-6 mb-2 h"> 
	      	<div 
	      		className="card h-100" 
            ref={node => this.getHeight(node)}
          > 
          	<IconMap></IconMap>
    		 	</div> 
   			</div> 
   			<div className="col-12 col-md-6 mt-4 mb-2">
          <Info height={`${this.state.height}px`} parentHeight={this.state.height} />
   			</div> 

			</div> 
		)
	}
}

const mapStateToProps = state => {
	const { data } = state
	return { data }
}

export default connect(mapStateToProps, null)(Home)
