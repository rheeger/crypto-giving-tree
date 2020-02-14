import * as types from "./types";
import localDB from "../../helpers/apis/localDB";
import history from "../../history";
import { approveOrgClaim } from "../../ethereum/org";

//DB ACTIONS: CLAIMS

export const createOrgClaim = (formValues, id, index, taxID) => async (
  dispatch,
  getState
) => {
  const response = await localDB.post(
    `/${process.env.REACT_APP_ETHERSCAN_PREFIX}claims`,
    {
      id: id.transactionHash,
      selectedOrg: taxID,
      ...formValues,
      claimIndex: index - 1,
      claimApprovalDetails: {
        claimApproval: false,
        dateApproved: null,
        transactionHash: ""
      }
    }
  );

  dispatch({ type: types.MAKE_ORG_CLAIM, payload: response.data });
  history.push(`/orgs/${taxID}`);
};

export const fetchClaims = () => async dispatch => {
  const response = await localDB.get(
    `/${process.env.REACT_APP_ETHERSCAN_PREFIX}claims`
  );

  dispatch({ type: types.FETCH_CLAIMS, payload: response.data });
};

export const fetchOrgApprovedClaims = ein => async dispatch => {
  const allClaims = await localDB.get(
    `/${process.env.REACT_APP_ETHERSCAN_PREFIX}claims`
  );
  const response = allClaims.data.filter(claim => {
    if (
      claim.claimApprovalDetails.claimApproval === true &&
      claim.selectedOrg === ein
    ) {
      return { claim };
    }
    return "";
  });

  dispatch({ type: types.FETCH_CLAIMS, payload: response });
};

export const fetchUnapprovedClaims = () => async dispatch => {
  const allClaims = await localDB.get(
    `/${process.env.REACT_APP_ETHERSCAN_PREFIX}claims`
  );
  const response = allClaims.data.filter(claim => {
    if (claim.claimApprovalDetails.claimApproval === false) {
      return { claim };
    }
    return "";
  });

  dispatch({ type: types.FETCH_CLAIMS, payload: response });
};

export const fetchOrgClaims = ein => async dispatch => {
  const allClaims = await localDB.get(
    `/${process.env.REACT_APP_ETHERSCAN_PREFIX}claims`
  );
  const response = allClaims.data.filter(claim => {
    if (claim.selectedOrg === ein) {
      return { claim };
    }
    return "";
  });

  dispatch({ type: types.FETCH_ORG_CLAIMS, payload: response });
};

export const fetchClaim = id => async dispatch => {
  const response = await localDB.get(
    `/${process.env.REACT_APP_ETHERSCAN_PREFIX}claims/${id}`
  );

  dispatch({ type: types.FETCH_CLAIM, payload: response.data });
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
  const response = await localDB.patch(
    `/${process.env.REACT_APP_ETHERSCAN_PREFIX}claims/${id}`,
    claimApprovalDetails
  );
  console.log(
    "claim details updated on /${process.env.REACT_APP_ETHERSCAN_PREFIX}claims"
  );

  dispatch({ type: types.EDIT_CLAIM, payload: response.data });
};

export const editClaim = (id, formValues) => async dispatch => {
  const response = await localDB.patch(
    `/${process.env.REACT_APP_ETHERSCAN_PREFIX}claims/${id}`,
    formValues
  );

  dispatch({ type: types.EDIT_CLAIM, payload: response.data });
  history.push("/admin");
};

export const deleteClaim = id => async dispatch => {
  await localDB.delete(
    `/${process.env.REACT_APP_ETHERSCAN_PREFIX}claims/${id}`
  );

  dispatch({ type: types.DELETE_CLAIM, payload: id });
  history.push("/admin");
};
