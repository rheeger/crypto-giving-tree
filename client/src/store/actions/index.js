import ProPublica from '../../apis/ProPublica';
import localDB from '../../apis/localDB';
import {
	ORG_SELECT,
	ORG_SEARCH,
	CREATE_BRANCH,
	FETCH_BRANCHES,
	FETCH_BRANCH,
	EDIT_BRANCH,
	DELETE_BRANCH,
	FETCH_ORGS,
	FETCH_ORG,
	EDIT_ORG,
	DELETE_ORG,
	CREATE_CONTRACT_ADDRESS
} from './types';
import history from '../../history';
import OrgFactory from '../../ethereum/build/OrgFactory.json';

//PRO PUBLICA ACTIONS
export const selectOrg = (ein) => async (dispatch) => {
	const response = await ProPublica.get(`/organizations/${ein}.json`).catch(function(error) {
		console.error(error);
	});

	dispatch({
		type: ORG_SELECT,
		payload: response.data
	});
};

export const searchOrgs = (term) => async (dispatch) => {
	const response = await ProPublica.get('/search.json?c_code%5Bid%5D=3', {
		params: { q: term }
	}).catch(function(error) {
		console.error(error);
	});

	dispatch({
		type: ORG_SEARCH,
		payload: response.data
	});
};

//LOCAL DB ACTIONS: BRANCHES
export const createBranch = (formValues) => async (dispatch, getState) => {
	const id = getState().web3connect.account;
	const response = await localDB.post('/branches', { ...formValues, id });

	dispatch({ type: CREATE_BRANCH, payload: response.data });
	history.push('/');
};

export const fetchBranches = () => async (dispatch) => {
	const response = await localDB.get('/branches');

	dispatch({ type: FETCH_BRANCHES, payload: response.data });
};

export const fetchBranch = (id) => async (dispatch) => {
	const response = await localDB.get(`/branches/${id}`);

	dispatch({ type: FETCH_BRANCH, payload: response.data });
};

export const editBranch = (id, formValues) => async (dispatch) => {
	const response = await localDB.patch(`/branches/${id}`, formValues);

	dispatch({ type: EDIT_BRANCH, payload: response.data });
	history.push('/');
};

export const deleteBranch = (id) => async (dispatch) => {
	await localDB.delete(`/branches/${id}`);

	dispatch({ type: DELETE_BRANCH, payload: id });
	history.push('/');
};

//LOCAL DB ACTIONS: ORGS

export const createOrgAndContract = (id) => async (dispatch, getState) => {
	const Web3 = require('web3');
	const HDWalletProvider = require('truffle-hdwallet-provider');

	const mnemonic = process.env.REACT_APP_METAMASK_MNEMONIC;
	const infuraKey = process.env.REACT_APP_INFURA_KEY;
	const infuraRinkebyEndpoint = 'https://rinkeby.infura.io/v3/' + infuraKey;

	const provider = new HDWalletProvider(mnemonic, infuraRinkebyEndpoint);

	const web3 = new Web3(provider);
	const accounts = await web3.eth.getAccounts();
	const address = '0x6b9d901467795364c40877cec5dd3f2602e6ece9';
	const orgFactory = new web3.eth.Contract(JSON.parse(OrgFactory.interface), address);

	const createContract = await orgFactory.methods.createOrg(id).send({ from: accounts[0], gas: '1000000' });
	console.log('transcomplete' + createContract);
	const contractAddress = createContract.events.orgCreated.returnValues.newAddress;

	const response = await localDB.post(`/orgs`, { id, contractAddress });

	dispatch({ type: CREATE_CONTRACT_ADDRESS, payload: response.data });
};

export const fetchOrgs = () => async (dispatch) => {
	const response = await localDB.get('/orgs');

	dispatch({ type: FETCH_ORGS, payload: response.data });
};

export const fetchOrg = (id) => async (dispatch) => {
	const response = await localDB.get(`/orgs/${id}`);

	dispatch({ type: FETCH_ORG, payload: response.data });
};

export const editOrg = (id, formValues) => async (dispatch) => {
	const response = await localDB.patch(`/orgs/${id}`, formValues);

	dispatch({ type: EDIT_ORG, payload: response.data });
	history.push('/');
};

export const deleteOrg = (id) => async (dispatch) => {
	await localDB.delete(`/orgs/${id}`);

	dispatch({ type: DELETE_ORG, payload: id });
	history.push('/');
};
