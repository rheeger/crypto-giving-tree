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
	CREATE_ORG,
	FETCH_ORGS,
	FETCH_ORG,
	EDIT_ORG,
	DELETE_ORG,
	CREATE_CONTRACT_ADDRESS
} from './types';
import history from '../../history';
import orgFactory from '../../ethereum/orgFactory';

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
export const createOrgAndContract = (id, account) => async (dispatch, getState) => {
	const createContract = await orgFactory.methods
		.createOrg(id)
		.send({ from: '0xB59EaB6A9C3AAC2dba42491502A0699c7b03A857' });
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
