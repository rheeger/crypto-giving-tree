import ProPublica from '../../apis/ProPublica';
import localDB from '../../apis/localDB';
import {
	ORG_SELECT,
	ORG_SEARCH,
	PLANT_TREE,
	EXTEND_GRANT,
	FETCH_TREES,
	FETCH_TREE,
	EDIT_TREE,
	DELETE_TREE,
	FETCH_ORGS,
	FETCH_ORG,
	EDIT_ORG,
	DELETE_ORG,
	CREATE_CONTRACT_ADDRESS,
	FETCH_TREE_DAI,
	CREATE_GRANT,
	FETCH_GRANTS,
	FETCH_TREE_GRANTS,
	FETCH_GRANT,
	EDIT_GRANT,
	DELETE_GRANT,
	RINKEBY_DAI
} from './types';
import history from '../../history';
import { createOrg } from '../../ethereum/orgFactoryAdmin';
import { plantTree } from '../../ethereum/treeNursreyAdmin';
import Tree from '../../ethereum/tree';

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

	const response = await localDB.post('/trees', { ...formValues, managerAddress, id, treeDAI: 0.0 });

	dispatch({ type: PLANT_TREE, payload: response.data });
	history.push(`/trees/${id}`);
};

export const extendGrant = (formValues, responsibleTree, id) => async (dispatch) => {
	const response = await localDB.post('/trees', { ...formValues, responsibleTree, id });

	dispatch({ type: EXTEND_GRANT, payload: response.data });
	history.push(`/trees/${id}`);
};

export const fetchTrees = (address) => async (dispatch) => {
	const allTrees = await localDB.get('/trees');

	const response = allTrees.data.filter((tree) => {
		if (tree.managerAddress === address) {
			return { tree };
		}
		return '';
	});

	dispatch({ type: FETCH_TREES, payload: response });
};

export const fetchTreeDAIBalance = (address) => async (dispatch) => {
	const tree = Tree(address);
	const treeDAIBalance = await tree.methods.getSummary(RINKEBY_DAI).call();
	console.log();
	const treeDAI = (parseFloat(treeDAIBalance[0]) / 1000000000000000000).toFixed(2);

	const response = await localDB.patch(`/trees/${address}`, { treeDAI: treeDAI });

	dispatch({ type: FETCH_TREE_DAI, payload: response.data });
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

//LOCAL DB ACTIONS: GRANTS

export const createGrant = (formValues, recipientAddress, recipientEIN, managerAddress) => async (
	dispatch,
	getState
) => {
	const tree = Tree(formValues.selectedTree);

	console.log(formValues);
	console.log(formValues.grantAmount * 10 ** 18);
	const id = await tree.methods
		.createGrant(formValues.grantDescription, formValues.grantAmount * 1000000000000000000, recipientAddress)
		.send({ from: managerAddress })
		.on('transactionHash', function(transId) {
			return transId;
		});

	console.log(id);

	const response = await localDB.post(`/grants`, {
		selectedOrg: recipientEIN,
		...formValues,
		id: id.transactionHash
	});

	dispatch({ type: CREATE_GRANT, payload: response.data });
	history.push(`/trees/${formValues.selectedTree}`);
};

export const fetchGrants = () => async (dispatch) => {
	const response = await localDB.get('/grants');

	dispatch({ type: FETCH_GRANTS, payload: response.data });
};

export const fetchTreeGrants = (address) => async (dispatch) => {
	const allGrants = await localDB.get('/trees');

	const response = allGrants.data.filter((grant) => {
		if (grant.managerAddress === address) {
			return { grant };
		}
		return '';
	});

	dispatch({ type: FETCH_TREE_GRANTS, payload: response.data });
};

export const fetchGrant = (id) => async (dispatch) => {
	const response = await localDB.get(`/grants/${id}`);

	dispatch({ type: FETCH_GRANT, payload: response.data });
};

export const editGrant = (id, formValues) => async (dispatch) => {
	const response = await localDB.patch(`/grants/${id}`, formValues);

	dispatch({ type: EDIT_GRANT, payload: response.data });
	history.push('/');
};

export const deleteGrant = (id) => async (dispatch) => {
	await localDB.delete(`/grants/${id}`);

	dispatch({ type: DELETE_GRANT, payload: id });
	history.push('/');
};
