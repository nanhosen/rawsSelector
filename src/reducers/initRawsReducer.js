import { INIT_RAWS_DATA } from '../actions/types'

export default function(state = {}, action){
	switch(action.type) {
		case INIT_RAWS_DATA:
			let initRawsData = action.payload
			return { ...initRawsData }
		default:
			return state
	}
}