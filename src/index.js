import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk'

import registerServiceWorker from './registerServiceWorker';
import './index.css'
import App from './App';
import reducers from './reducers'


const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore)
export const store = createStoreWithMiddleware(reducers)
// console.log(store)

ReactDOM.render(
	<Provider store ={store}>
		<App />
	</Provider>, 
	document.getElementById('root')
);
registerServiceWorker();


