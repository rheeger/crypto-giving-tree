import { combineReducers } from 'redux';
import { orgs, org } from './orgs';

export default combineReducers({
	orgs: orgs,
	org: org
});
