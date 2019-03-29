import { SET_MONTHS } from '../actions/types'

export default function(state = [0, 11], action){
	switch(action.type) {
		case SET_MONTHS:
			return action.payload
		default:
			return state
	}
} 
