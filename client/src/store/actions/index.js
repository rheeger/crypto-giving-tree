import ProPublica from '../../apis/ProPublica';
import localDB from '../../apis/localDB';
import {
	ORG_SELECT,
	ORG_SEARCH,
	PLANT_TREE,
	FETCH_TREES,
	FETCH_TREE,
	EDIT_TREE,
	DELETE_TREE,
	FETCH_ORGS,
	FETCH_ORG,
	EDIT_ORG,
	DELETE_ORG,
	CREATE_CONTRACT_ADDRESS
} from './types';
import history from '../../history';
import { createOrg } from '../../ethereum/orgFactoryAdmin';
import { plantTree } from '../../ethereum/treeNursreyAdmin';

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

//LOCAL DB ACTIONS: TREEES
export const plantTreeAndContract = (formValues) => async (dispatch, getState) => {
	const managerAddress = getState().web3connect.account;
	const id = await plantTree(managerAddress);

	const response = await localDB.post('/trees', { ...formValues, managerAddress, id });

	dispatch({ type: PLANT_TREE, payload: response.data });
	history.push(`/trees/${id}`);
};

export const fetchTrees = () => async (dispatch) => {
	const response = await localDB.get('/trees');

	dispatch({ type: FETCH_TREES, payload: response.data });
};

export const fetchTree = (id) => async (dispatch) => {
	const response = await localDB.get(`/trees/${id}`);

	dispatch({ type: FETCH_TREE, payload: response.data });
};

export const editTree = (id, formValues) => async (dispatch) => {
	const response = await localDB.patch(`/trees/${id}`, formValues);

	dispatch({ type: EDIT_TREE, payload: response.data });
	history.push('/');
};

export const deleteTree = (id) => async (dispatch) => {
	await localDB.delete(`/trees/${id}`);

	dispatch({ type: DELETE_TREE, payload: id });
	history.push('/');
};

//LOCAL DB ACTIONS: ORGS

export const createOrgAndContract = (id) => async (dispatch, getState) => {
	const contractAddress = await createOrg(id);

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
