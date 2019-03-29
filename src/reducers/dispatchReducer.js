import { SELECTED_DISPATCH } from '../actions/types'

export default function(state = null, action){
	switch(action.type) {
		case SELECTED_DISPATCH:
			return action.payload
		default:
			return state
	}
}