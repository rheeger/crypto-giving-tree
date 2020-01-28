import * as types from "./types";
import localDB from "../../helpers/apis/localDB";
import history from "../../history";
import { fetchOrgLifetimeGrants } from "./orgs";
import { approveFundGrant } from "../../ethereum/fund";
//LOCAL DB ACTIONS: GRANTS

export const createGrant = (
  formValues,
  transactionHash,
  recipientEIN,
  index
) => async (dispatch, getState) => {
  const response = await localDB.post(`/grants`, {
    id: transactionHash,
    selectedOrg: recipientEIN,
    selectedFund: formValues.selectedFund.id,
    grantAmount: formValues.grantAmount,
    grantDescription: formValues.grantDescription,
    grantMemo: formValues.grantMemo,
    grantApproval: false,
    grantIndex: index - 1,
    approvalDetails: {},
    dateApproved: null
  });

  dispatch({ type: types.CREATE_GRANT, payload: response.data });
  history.push(`/funds/${formValues.selectedFund.id}`);
};

export const approveGrant = (id, fundAddress, grantNonce) => async (
  dispatch,
  getState
) => {
  const approvalDetails = await approveFundGrant(
    fundAddress,
    grantNonce,
    process.env.REACT_APP_STABLECOIN_ADDRESS
  );
  const response = await localDB.patch(`/grants/${id}`, {
    grantApproval: true,
    approvalDetails,
    dateApproved: Date.now()
  });
  const grantDetails = await localDB.get(`/grants/${id}`);
  await fetchOrgLifetimeGrants(grantDetails.selectedOrg);

  dispatch({ type: types.EDIT_GRANT, payload: response.data });
  window.location.reload();
};

export const fetchGrants = () => async dispatch => {
  const response = await localDB.get("/grants");

  dispatch({ type: types.FETCH_GRANTS, payload: response.data });
};

export const fetchOrgApprovedGrants = ein => async dispatch => {
  const allGrants = await localDB.get("/grants");
  const response = allGrants.data.filter(grant => {
    if (grant.grantApproval === true && grant.selectedOrg === ein) {
      return { grant };
    }
    return "";
  });

  dispatch({ type: types.FETCH_GRANTS, payload: response });
};

export const fetchUnapprovedGrants = () => async dispatch => {
  const allGrants = await localDB.get("/grants");
  const response = allGrants.data.filter(grant => {
    if (grant.grantApproval === false) {
      return { grant };
    }
    return "";
  });

  dispatch({ type: types.FETCH_GRANTS, payload: response });
};

export const fetchFundGrants = address => async dispatch => {
  const allGrants = await localDB.get("/grants");
  const response = allGrants.data.filter(grant => {
    if (grant.selectedFund === address) {
      return { grant };
    }
    return "";
  });

  dispatch({ type: types.FETCH_FUND_GRANTS, payload: response });
};

export const fetchOrgGrants = ein => async dispatch => {
  const allGrants = await localDB.get("/grants");
  const response = allGrants.data.filter(grant => {
    if (grant.selectedOrg === ein) {
      return { grant };
    }
    return "";
  });

  dispatch({ type: types.FETCH_ORG_GRANTS, payload: response });
};

export const fetchGrant = id => async dispatch => {
  const response = await localDB.get(`/grants/${id}`);

  dispatch({ type: types.FETCH_GRANT, payload: response.data });
};

export const editGrant = (id, formValues) => async dispatch => {
  const response = await localDB.patch(`/grants/${id}`, formValues);

  dispatch({ type: types.EDIT_GRANT, payload: response.data });
  history.push("/admin");
};

export const deleteGrant = id => async dispatch => {
  await localDB.delete(`/grants/${id}`);

  dispatch({ type: types.DELETE_GRANT, payload: id });
  history.push("/admin");
};
