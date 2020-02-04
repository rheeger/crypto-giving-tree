import * as types from "./types";
import ProPublica from "../../helpers/apis/ProPublica";
import localDB from "../../helpers/apis/localDB";
import history from "../../history";
import { createOrg } from "../../ethereum/orgFactoryAdmin";

//PRO PUBLICA ACTIONS
export const selectOrg = ein => async dispatch => {
  const response = await ProPublica.get(`/organizations/${ein}.json`).catch(
    function(error) {
      console.error(error);
    }
  );

  dispatch({
    type: types.ORG_SELECT,
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
      type: types.ORG_SEARCH,
      payload: { organizations: "404", total_results: 0 }
    });
  } else {
    dispatch({
      type: types.ORG_SEARCH,
      payload: response.data
    });
  }
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

  dispatch({ type: types.CREATE_CONTRACT_ADDRESS, payload: response.data });
};

export const fetchOrgs = () => async dispatch => {
  const response = await localDB.get("/orgs");

  dispatch({ type: types.FETCH_ORGS, payload: response.data });
};

export const fetchOrg = id => async dispatch => {
  const response = await localDB.get(`/orgs/${id}`);

  dispatch({ type: types.FETCH_ORG, payload: response.data });
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

  dispatch({ type: types.EDIT_ORG, payload: response.data });
};

export const claimOrg = (id, claimId) => async dispatch => {
  console.log("getting details for: " + claimId);
  const claimDetails = await localDB.get(`/claims/${claimId}`);
  console.log("final claim details grabbed:");
  console.log(claimDetails.data);
  const response = await localDB.patch(`/orgs/${id}`, {
    claimed: true,
    claimApprovalDetails: {
      dateApproved: claimDetails.data.claimApprovalDetails.dateApproved,
      orgAdminWallet: claimDetails.data.orgAdminWallet,
      claimId: claimDetails.data.id,
      transactionHash: claimDetails.data.claimApprovalDetails.transactionHash
    }
  });

  dispatch({ type: types.EDIT_ORG, payload: response.data });
  window.location.reload();
};

export const editOrg = (id, formValues) => async dispatch => {
  const response = await localDB.patch(`/orgs/${id}`, formValues);

  dispatch({ type: types.EDIT_ORG, payload: response.data });
  history.push("/");
};

export const deleteOrg = id => async dispatch => {
  await localDB.delete(`/orgs/${id}`);

  dispatch({ type: types.DELETE_ORG, payload: id });
  history.push("/");
};
