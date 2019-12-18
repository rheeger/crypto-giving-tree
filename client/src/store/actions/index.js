import ProPublica from "../../apis/ProPublica";
import localDB from "../../apis/localDB";
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
  DELETE_DONATION,
  MAKE_ORG_CLAIM,
  FETCH_CLAIMS,
  FETCH_ORG_CLAIMS,
  FETCH_CLAIM,
  EDIT_CLAIM,
  DELETE_CLAIM
} from "./types";
import history from "../../history";
import { createOrg } from "../../ethereum/orgFactoryAdmin";
import { plantTree } from "../../ethereum/treeNursreyAdmin";
import { treeContract, approveTreeGrant } from "../../ethereum/tree";
import { orgContract, approveOrgClaim } from "../../ethereum/org";
import BN from "bignumber.js";

//PRO PUBLICA ACTIONS
export const selectOrg = ein => async dispatch => {
  const response = await ProPublica.get(`/organizations/${ein}.json`).catch(
    function(error) {
      console.error(error);
    }
  );

  dispatch({
    type: ORG_SELECT,
    payload: response.data
  });
};

export const searchOrgs = term => async dispatch => {
  const response = await ProPublica.get("/search.json?c_code%5Bid%5D=3", {
    params: { q: term }
  }).catch(function(error) {
    console.error(error);
  });

  if (response === undefined) {
    dispatch({
      type: ORG_SEARCH,
      payload: { organizations: "404", total_results: 0 }
    });
  } else {
    dispatch({
      type: ORG_SEARCH,
      payload: response.data
    });
  }
};

//LOCAL DB ACTIONS: TREES
export const plantTreeAndContract = formValues => async (
  dispatch,
  getState
) => {
  const { account } = getState().web3connect;
  const createdContract = await plantTree(account);
  const response = await localDB.post("/trees", {
    ...formValues,
    managerAddress: account,
    id: createdContract.id,
    treeDAI: "0.00",
    grantableDAI: 0.0
  });

  dispatch({ type: PLANT_TREE, payload: response.data });
  history.push(`/trees/${createdContract.id}`);
};

export const fetchTrees = () => async dispatch => {
  const response = await localDB.get("/trees");

  dispatch({ type: FETCH_TREES, payload: response.data });
};

export const fetchUserTrees = address => async dispatch => {
  const allTrees = await localDB.get("/trees");
  const response = allTrees.data.filter(tree => {
    if (tree.managerAddress === address) {
      return { tree };
    }
    return "";
  });

  dispatch({ type: FETCH_TREES, payload: response });
};

export const fetchTreeDAIBalance = address => async dispatch => {
  const tree = treeContract(address);
  const treeDAIBalance = await tree.methods.getSummary(RINKEBY_DAI).call();
  const treeDAI = (
    parseFloat(treeDAIBalance[0]) / 1000000000000000000 -
    0.01
  ).toFixed(2);

  const response = await localDB.patch(`/trees/${address}`, {
    treeDAI: treeDAI
  });

  dispatch({ type: FETCH_TREE_DAI, payload: response.data });
};

export const fetchGrantableDAIBalance = address => async dispatch => {
  const tree = treeContract(address);
  const treeDAIBalance = await tree.methods.getSummary(RINKEBY_DAI).call();
  const treeDAI = (
    parseFloat(treeDAIBalance[0]) / 1000000000000000000 -
    0.01
  ).toFixed(2);

  const allGrants = await localDB.get("/grants");
  const treeGrants = allGrants.data.filter(grant => {
    if (grant.selectedTree === address && grant.grantApproval === false) {
      return { grant };
    }
    return "";
  });

  const pendingGrants = Object.values(treeGrants).reduce(
    (a, b) => a + (parseFloat(b["grantAmount"]) || 0),
    0
  );
  const grantableDAI = (treeDAI - pendingGrants).toFixed(2);

  const response = await localDB.patch(`/trees/${address}`, {
    grantableDAI: grantableDAI
  });

  dispatch({ type: FETCH_GRANTABLE_DAI, payload: response.data });
};
export const fetchTree = id => async dispatch => {
  const response = await localDB.get(`/trees/${id}`);

  dispatch({ type: FETCH_TREE, payload: response.data });
};

export const editTree = (id, formValues) => async dispatch => {
  const response = await localDB.patch(`/trees/${id}`, formValues);

  dispatch({ type: EDIT_TREE, payload: response.data });
  history.push("/");
};

export const deleteTree = id => async dispatch => {
  await localDB.delete(`/trees/${id}`);

  dispatch({ type: DELETE_TREE, payload: id });
  history.push("/");
};

//LOCAL DB ACTIONS: ORGS

export const createOrgAndContract = (id, name) => async (
  dispatch,
  getState
) => {
  const contractAddress = await createOrg(id);

  const response = await localDB.post(`/orgs`, {
    id,
    name,
    contractAddress,
    lifetimeGrants: 0,
    claimed: false,
    claimApprovalDetails: {}
  });

  dispatch({ type: CREATE_CONTRACT_ADDRESS, payload: response.data });
};

export const fetchOrgs = () => async dispatch => {
  const response = await localDB.get("/orgs");

  dispatch({ type: FETCH_ORGS, payload: response.data });
};

export const fetchOrg = id => async dispatch => {
  const response = await localDB.get(`/orgs/${id}`);

  dispatch({ type: FETCH_ORG, payload: response.data });
};

export const fetchOrgLifetimeGrants = id => async dispatch => {
  const allGrants = await localDB.get("/grants");
  const orgGrants = allGrants.data.filter(grant => {
    if (grant.selectedOrg === id && grant.grantApproval === true) {
      return { grant };
    }
    return "";
  });

  const completedGrants = Object.values(orgGrants)
    .reduce((a, b) => a + (parseFloat(b["grantAmount"]) || 0), 0)
    .toFixed(2);

  const response = await localDB.patch(`/orgs/${id}`, {
    lifetimeGrants: completedGrants
  });

  dispatch({ type: EDIT_ORG, payload: response.data });
};

export const claimOrg = (id, claimId) => async dispatch => {
  console.log("getting details for: " + claimId);
  const claimDetails = await localDB.get(`/claims/${claimId}`);
  console.log("final claim details grabbed:");
  console.log(claimDetails.data);
  const response = await localDB.patch(`/orgs/${id}`, {
    claimed: true,
    claimApprovalDetails: {
      approvalDate: claimDetails.data.claimApprovalDetails.dateApproved,
      orgAdminWallet: claimDetails.data.orgAdminWallet,
      claimId: claimDetails.data.id,
      transactionHash: claimDetails.data.claimApprovalDetails.transactionHash
    }
  });

  dispatch({ type: EDIT_ORG, payload: response.data });
  history.push(`/admin`);
};

export const editOrg = (id, formValues) => async dispatch => {
  const response = await localDB.patch(`/orgs/${id}`, formValues);

  dispatch({ type: EDIT_ORG, payload: response.data });
  history.push("/");
};

export const deleteOrg = id => async dispatch => {
  await localDB.delete(`/orgs/${id}`);

  dispatch({ type: DELETE_ORG, payload: id });
  history.push("/");
};

export const createOrgClaim = (
  formValues,
  orgAdminWallet,
  orgContractAddress,
  taxID
) => async (dispatch, getState) => {
  const org = orgContract(orgContractAddress);
  const id = await org.methods
    .claimRequest(
      formValues.orgAdminFirstName,
      formValues.orgAdminLastName,
      true,
      formValues.orgAdminEmail,
      orgAdminWallet
    )
    .send({ from: orgAdminWallet })
    .on("transactionHash", function(transId) {
      console.log(transId);
      return transId;
    });
  const index = await org.methods.getClaimsCount().call();
  const response = await localDB.post(`/claims`, {
    id: id.transactionHash,
    selectedOrg: taxID,
    ...formValues,
    claimIndex: index - 1,
    claimApprovalDetails: {
      claimApproval: false,
      dateApproved: null,
      transactionHash: ""
    }
  });

  dispatch({ type: MAKE_ORG_CLAIM, payload: response.data });
  history.push(`/orgs/${taxID}`);
};

export const fetchClaims = () => async dispatch => {
  const response = await localDB.get("/claims");

  dispatch({ type: FETCH_CLAIMS, payload: response.data });
};

export const fetchOrgApprovedClaims = ein => async dispatch => {
  const allClaims = await localDB.get("/claims");
  const response = allClaims.data.filter(claim => {
    if (
      claim.claimApprovalDetails.claimApproval === true &&
      claim.selectedOrg === ein
    ) {
      return { claim };
    }
    return "";
  });

  dispatch({ type: FETCH_CLAIMS, payload: response });
};

export const fetchUnapprovedClaims = () => async dispatch => {
  const allClaims = await localDB.get("/claims");
  const response = allClaims.data.filter(claim => {
    if (claim.claimApprovalDetails.claimApproval === false) {
      return { claim };
    }
    return "";
  });

  dispatch({ type: FETCH_CLAIMS, payload: response });
};

export const fetchOrgClaims = ein => async dispatch => {
  const allClaims = await localDB.get("/claims");
  const response = allClaims.data.filter(claim => {
    if (claim.selectedOrg === ein) {
      return { claim };
    }
    return "";
  });

  dispatch({ type: FETCH_ORG_CLAIMS, payload: response });
};

export const fetchClaim = id => async dispatch => {
  const response = await localDB.get(`/claims/${id}`);

  dispatch({ type: FETCH_CLAIM, payload: response.data });
};

export const approveClaim = (id, orgAddress, claimNonce) => async (
  dispatch,
  getState
) => {
  console.log("attempting to approve claim on chain");
  const trans = await approveOrgClaim(orgAddress, claimNonce);
  console.log("claim approved on chain");
  const claimApprovalDetails = {
    claimApprovalDetails: {
      claimApproval: true,
      dateApproved: Date.now(),
      transactionHash: trans
    }
  };
  const response = await localDB.patch(`/claims/${id}`, claimApprovalDetails);
  console.log("claim details updated on /claims");

  dispatch({ type: EDIT_CLAIM, payload: response.data });
};

export const editClaim = (id, formValues) => async dispatch => {
  const response = await localDB.patch(`/claims/${id}`, formValues);

  dispatch({ type: EDIT_CLAIM, payload: response.data });
  history.push("/admin");
};

export const deleteClaim = id => async dispatch => {
  await localDB.delete(`/claims/${id}`);

  dispatch({ type: DELETE_CLAIM, payload: id });
  history.push("/admin");
};

//LOCAL DB ACTIONS: GRANTS

export const createGrant = (
  formValues,
  recipientAddress,
  recipientEIN,
  managerAddress
) => async (dispatch, getState) => {
  const tree = treeContract(formValues.selectedTree.id);
  const id = await tree.methods
    .createGrant(
      formValues.grantDescription,
      BN(formValues.grantAmount)
        .multipliedBy(10 ** 18)
        .toFixed(),
      recipientAddress
    )
    .send({ from: managerAddress })
    .on("transactionHash", function(transId) {
      console.log(transId);
      return transId;
    });
  const index = await tree.methods.getGrantsCount().call();
  const response = await localDB.post(`/grants`, {
    id: id.transactionHash,
    selectedOrg: recipientEIN,
    ...formValues,
    grantApproval: false,
    grantIndex: index - 1,
    approvalDetails: {},
    dateApproved: null
  });

  dispatch({ type: CREATE_GRANT, payload: response.data });
  history.push(`/trees/${formValues.selectedTree.id}`);
};

export const approveGrant = (id, treeAddress, grantNonce) => async (
  dispatch,
  getState
) => {
  const approvalDetails = await approveTreeGrant(
    treeAddress,
    grantNonce,
    RINKEBY_DAI
  );
  const response = await localDB.patch(`/grants/${id}`, {
    grantApproval: true,
    approvalDetails,
    dateApproved: Date.now()
  });
  const grantDetails = await localDB.get(`/grants/${id}`);
  await fetchOrgLifetimeGrants(grantDetails.selectedOrg);

  dispatch({ type: EDIT_GRANT, payload: response.data });
  window.location.reload();
};

export const fetchGrants = () => async dispatch => {
  const response = await localDB.get("/grants");

  dispatch({ type: FETCH_GRANTS, payload: response.data });
};

export const fetchOrgApprovedGrants = ein => async dispatch => {
  const allGrants = await localDB.get("/grants");
  const response = allGrants.data.filter(grant => {
    if (grant.grantApproval === true && grant.selectedOrg === ein) {
      return { grant };
    }
    return "";
  });

  dispatch({ type: FETCH_GRANTS, payload: response });
};

export const fetchUnapprovedGrants = () => async dispatch => {
  const allGrants = await localDB.get("/grants");
  const response = allGrants.data.filter(grant => {
    if (grant.grantApproval === false) {
      return { grant };
    }
    return "";
  });

  dispatch({ type: FETCH_GRANTS, payload: response });
};

export const fetchTreeGrants = address => async dispatch => {
  const allGrants = await localDB.get("/grants");
  const response = allGrants.data.filter(grant => {
    if (grant.selectedTree === address) {
      return { grant };
    }
    return "";
  });

  dispatch({ type: FETCH_TREE_GRANTS, payload: response });
};

export const fetchOrgGrants = ein => async dispatch => {
  const allGrants = await localDB.get("/grants");
  const response = allGrants.data.filter(grant => {
    if (grant.selectedOrg === ein) {
      return { grant };
    }
    return "";
  });

  dispatch({ type: FETCH_ORG_GRANTS, payload: response });
};

export const fetchGrant = id => async dispatch => {
  const response = await localDB.get(`/grants/${id}`);

  dispatch({ type: FETCH_GRANT, payload: response.data });
};

export const editGrant = (id, formValues) => async dispatch => {
  const response = await localDB.patch(`/grants/${id}`, formValues);

  dispatch({ type: EDIT_GRANT, payload: response.data });
  history.push("/admin");
};

export const deleteGrant = id => async dispatch => {
  await localDB.delete(`/grants/${id}`);

  dispatch({ type: DELETE_GRANT, payload: id });
  history.push("/admin");
};

//LOCAL DB ACTIONS: DONATIONS

export const createDonation = (
  txID,
  treeAddress,
  fromAddress,
  inputCurrency,
  inputAmount,
  outputAmount
) => async dispatch => {
  const finalTradeOutput = (outputAmount / 1000000000000000000 - 0.01).toFixed(
    2
  );
  const response = await localDB.post(`/donations`, {
    id: txID,
    to: treeAddress,
    from: fromAddress,
    inputCurrency,
    inputAmount,
    finalTradeOutput
  });

  dispatch({ type: CREATE_DONATION, payload: response.data });
  window.location.reload();
};

export const fetchDonations = () => async dispatch => {
  const response = await localDB.get("/donations");

  dispatch({ type: FETCH_DONATIONS, payload: response.data });
};

export const fetchTreeDonations = address => async dispatch => {
  const allDonations = await localDB.get("/donations");
  const response = allDonations.data.filter(donation => {
    if (donation.to === address) {
      return { donation };
    }
    return "";
  });

  dispatch({ type: FETCH_TREE_DONATIONS, payload: response });
};

export const fetchDonation = id => async dispatch => {
  const response = await localDB.get(`/donations/${id}`);

  dispatch({ type: FETCH_DONATION, payload: response.data });
};

export const deleteDonation = id => async dispatch => {
  await localDB.delete(`/donations/${id}`);

  dispatch({ type: DELETE_DONATION, payload: id });
  history.push("/");
};
