import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { orgs, org, gtOrgs } from './orgs';
import branches from './branches';
import swapAddresses from './swapAddresses';
import web3connect from './web3connect';

export default combineReducers({
	orgs: orgs,
	org: org,
	addresses: swapAddresses,
	web3connect: web3connect,
	form: formReducer,
	GTbranches: branches,
	gtOrgs: gtOrgs
});
