import { combineReducers } from 'redux'
import dispatchReducer from './dispatchReducer'
import monthsReducer from './monthsReducer'
import initRawsReducer from './initRawsReducer'
import kValueReducer from './kValueReducer'

const rootReducer = combineReducers({
	dispatchArea: dispatchReducer,
	monthRange: monthsReducer,
	initData: initRawsReducer,
	kValue: kValueReducer
})

export default rootReducer

