import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import reducers from '.';

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
export function makeStore() {
	return createStore(reducers, composeEnhancers(applyMiddleware(thunk)));
}
