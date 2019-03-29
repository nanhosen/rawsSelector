import { K_VALUE } from '../actions/types'

export default function(state = 1, action){
	switch(action.type) {
		case K_VALUE:
			return action.payload
		default:
			return state
	}
} 
