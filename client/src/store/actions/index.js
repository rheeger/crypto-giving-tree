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
	CREATE_CONTRACT_ADDRESS,
	FETCH_TREE_DAI,
	FETCH_GRANTABLE_DAI,
	CREATE_GRANT,
	FETCH_GRANTS,
	FETCH_TREE_GRANTS,
	FETCH_GRANT,
	EDIT_GRANT,
	DELETE_GRANT,
	RINKEBY_DAI,
	FETCH_ORG_GRANTS,
	CREATE_DONATION,
	FETCH_DONATIONS,
	FETCH_TREE_DONATIONS,
	FETCH_DONATION,
	DELETE_DONATION
} from './types';
import history from '../../history';
import { createOrg } from '../../ethereum/orgFactoryAdmin';
import { plantTree } from '../../ethereum/treeNursreyAdmin';
import { treeContract, approveTreeGrant } from '../../ethereum/tree';

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

	if (response === undefined) {
		dispatch({
			type: ORG_SEARCH,
			payload: { organizations: '404', total_results: 0 }
		});
	} else {
		dispatch({
			type: ORG_SEARCH,
			payload: response.data
		});
	}
};

//LOCAL DB ACTIONS: TREES
export const plantTreeAndContract = (formValues) => async (dispatch, getState) => {
	const { account } = getState().web3connect;
	const createdContract = await plantTree(account);

	// const metaWeb3 = getState().web3connect.web3;
	// const blockInfo = await metaWeb3.eth.getBlock(createdContract.blockNumber);
	// const approvalDate = new Date(blockInfo.timestamp * 1000);
	// const formattedApprovalDate = new Intl.DateTimeFormat('en-US').format(approvalDate);

	const response = await localDB.post('/trees', {
		...formValues,
		managerAddress: account,
		id: createdContract.id,
		treeDAI: '0.00',
		datePlanted: '',
		grantableDAI: 0.0
	});

	dispatch({ type: PLANT_TREE, payload: response.data });
	history.push(`/trees/${createdContract.id}`);
};

export const fetchTrees = () => async (dispatch) => {
	const response = await localDB.get('/trees');

	dispatch({ type: FETCH_TREES, payload: response });
};

export const fetchUserTrees = (address) => async (dispatch) => {
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
	const tree = treeContract(address);
	const treeDAIBalance = await tree.methods.getSummary(RINKEBY_DAI).call();
	const treeDAI = (parseFloat(treeDAIBalance[0]) / 1000000000000000000 - 0.01).toFixed(2);

	const response = await localDB.patch(`/trees/${address}`, { treeDAI: treeDAI });

	dispatch({ type: FETCH_TREE_DAI, payload: response.data });
};

export const fetchGrantableDAIBalance = (address) => async (dispatch) => {
	const tree = treeContract(address);
	const treeDAIBalance = await tree.methods.getSummary(RINKEBY_DAI).call();
	const treeDAI = (parseFloat(treeDAIBalance[0]) / 1000000000000000000 - 0.01).toFixed(2);

	const allGrants = await localDB.get('/grants');
	const treeGrants = allGrants.data.filter((grant) => {
		if (grant.selectedTree === address && grant.grantApproval === false) {
			return { grant };
		}
		return '';
	});

	const pendingGrants = Object.values(treeGrants).reduce((a, b) => a + (parseFloat(b['grantAmount']) || 0), 0);
	const grantableDAI = (treeDAI - pendingGrants).toFixed(2);

	const response = await localDB.patch(`/trees/${address}`, { grantableDAI: grantableDAI });

	dispatch({ type: FETCH_GRANTABLE_DAI, payload: response.data });
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

export const createOrgAndContract = (id, name) => async (dispatch, getState) => {
	const contractAddress = await createOrg(id);

	const response = await localDB.post(`/orgs`, { id, name, contractAddress, lifetimeGrants: 0, claimed: false });

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

export const fetchOrgLifetimeGrants = (id) => async (dispatch) => {
	const allGrants = await localDB.get('/grants');
	const orgGrants = allGrants.data.filter((grant) => {
		if (grant.selectedOrg === id && grant.grantApproval === true) {
			return { grant };
		}
		return '';
	});

	const completedGrants = Object.values(orgGrants)
		.reduce((a, b) => a + (parseFloat(b['grantAmount']) || 0), 0)
		.toFixed(2);

	const response = await localDB.patch(`/orgs/${id}`, { lifetimeGrants: completedGrants });

	dispatch({ type: EDIT_ORG, payload: response.data });
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
	const web3 = getState().web3connect.web3;
	const tree = treeContract(formValues.selectedTree);
	const id = await tree.methods
		.createGrant(formValues.grantDescription, formValues.grantAmount * 1000000000000000000, recipientAddress)
		.send({ from: managerAddress })
		.on('transactionHash', function(transId) {
			console.log(transId);
			return transId;
		});

	const index = await tree.methods.getGrantsCount().call();

	const blockInfo = await web3.eth.getBlock(id.blockNumber);
	console.log(blockInfo);

	const grantDate = new Date(blockInfo.timestamp * 1000);
	const formattedGrantDate = Intl.DateTimeFormat('en-US').format(grantDate);

	const response = await localDB.post(`/grants`, {
		selectedOrg: recipientEIN,
		...formValues,
		id: id.transactionHash,
		grantDate: formattedGrantDate,
		grantApproval: false,
		grantIndex: index - 1
	});

	dispatch({ type: CREATE_GRANT, payload: response.data });
	history.push(`/trees/${formValues.selectedTree}`);
};

export const approveGrant = (id, treeAddress, grantNonce) => async (dispatch, getState) => {
	const web3 = getState().web3connect.web3;
	const approvalDetails = await approveTreeGrant(treeAddress, grantNonce, RINKEBY_DAI);

	const blockInfo = await web3.eth.getBlock(approvalDetails.blockNumber);
	const approvalDate = new Date(blockInfo.timestamp * 1000);
	const formattedApprovalDate = new Intl.DateTimeFormat('en-US').format(approvalDate);

	const response = await localDB.patch(`/grants/${id}`, {
		grantApproval: true,
		approvalDetails,
		dateApproved: formattedApprovalDate
	});

	dispatch({ type: EDIT_GRANT, payload: response.data });
	history.push('/admin');
};

export const fetchGrants = () => async (dispatch) => {
	const response = await localDB.get('/grants');

	dispatch({ type: FETCH_GRANTS, payload: response.data });
};

export const fetchOrgApprovedGrants = (ein) => async (dispatch) => {
	const allGrants = await localDB.get('/grants');
	const response = allGrants.data.filter((grant) => {
		if (grant.grantApproval === true && grant.selectedOrg === ein) {
			return { grant };
		}
		return '';
	});

	dispatch({ type: FETCH_GRANTS, payload: response });
};

export const fetchUnapprovedGrants = () => async (dispatch) => {
	const allGrants = await localDB.get('/grants');
	const response = allGrants.data.filter((grant) => {
		if (grant.grantApproval === false) {
			return { grant };
		}
		return '';
	});

	dispatch({ type: FETCH_GRANTS, payload: response });
};

export const fetchTreeGrants = (address) => async (dispatch) => {
	const allGrants = await localDB.get('/grants');
	const response = allGrants.data.filter((grant) => {
		if (grant.selectedTree === address) {
			return { grant };
		}
		return '';
	});

	dispatch({ type: FETCH_TREE_GRANTS, payload: response });
};

export const fetchOrgGrants = (ein) => async (dispatch) => {
	const allGrants = await localDB.get('/grants');
	const response = allGrants.data.filter((grant) => {
		if (grant.selectedOrg === ein) {
			return { grant };
		}
		return '';
	});

	dispatch({ type: FETCH_ORG_GRANTS, payload: response });
};

export const fetchGrant = (id) => async (dispatch) => {
	const response = await localDB.get(`/grants/${id}`);

	dispatch({ type: FETCH_GRANT, payload: response.data });
};

export const editGrant = (id, formValues) => async (dispatch) => {
	const response = await localDB.patch(`/grants/${id}`, formValues);

	dispatch({ type: EDIT_GRANT, payload: response.data });
	history.push('/admin');
};

export const deleteGrant = (id) => async (dispatch) => {
	await localDB.delete(`/grants/${id}`);

	dispatch({ type: DELETE_GRANT, payload: id });
	history.push('/admin');
};

//LOCAL DB ACTIONS: DONATIONS

export const createDonation = (
	txID,
	treeAddress,
	fromAddress,
	inputCurrency,
	inputAmount,
	outputAmount,
	donationDate
) => async (dispatch) => {
	const finalTradeOutput = (outputAmount / 1000000000000000000 - 0.01).toFixed(2);
	const response = await localDB.post(`/donations`, {
		id: txID,
		to: treeAddress,
		from: fromAddress,
		inputCurrency,
		inputAmount,
		finalTradeOutput,
		donationDate
	});

	dispatch({ type: CREATE_DONATION, payload: response.data });
	history.push(`/trees/${treeAddress}`);
};

export const fetchDonations = () => async (dispatch) => {
	const response = await localDB.get('/donations');

	dispatch({ type: FETCH_DONATIONS, payload: response.data });
};

export const fetchTreeDonations = (address) => async (dispatch) => {
	const allDonations = await localDB.get('/donations');
	const response = allDonations.data.filter((donation) => {
		if (donation.to === address) {
			return { donation };
		}
		return '';
	});

	dispatch({ type: FETCH_TREE_DONATIONS, payload: response });
};

export const fetchDonation = (id) => async (dispatch) => {
	const response = await localDB.get(`/donations/${id}`);

	dispatch({ type: FETCH_DONATION, payload: response.data });
};

export const deleteDonation = (id) => async (dispatch) => {
	await localDB.delete(`/donations/${id}`);

	dispatch({ type: DELETE_DONATION, payload: id });
	history.push('/');
};
