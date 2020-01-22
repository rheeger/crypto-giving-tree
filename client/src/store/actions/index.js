import ProPublica from "../../apis/ProPublica";
import localDB from "../../apis/localDB";
import {
  ORG_SELECT,
  ORG_SEARCH,
  PLANT_FUND,
  FETCH_FUNDS,
  FETCH_FUND,
  EDIT_FUND,
  DELETE_FUND,
  FETCH_ORGS,
  FETCH_ORG,
  EDIT_ORG,
  DELETE_ORG,
  CREATE_CONTRACT_ADDRESS,
  FETCH_FUND_DAI,
  FETCH_GRANTABLE_DAI,
  CREATE_GRANT,
  FETCH_GRANTS,
  FETCH_FUND_GRANTS,
  FETCH_GRANT,
  EDIT_GRANT,
  DELETE_GRANT,
  FETCH_ORG_GRANTS,
  CREATE_DONATION,
  FETCH_DONATIONS,
  FETCH_FUND_DONATIONS,
  FETCH_DONATION,
  DELETE_DONATION,
  MAKE_ORG_CLAIM,
  FETCH_CLAIMS,
  FETCH_ORG_CLAIMS,
  FETCH_CLAIM,
  EDIT_CLAIM,
  DELETE_CLAIM,
  MAKE_ORG_WITHDRAWL,
  FETCH_WITHDRAWLS,
  FETCH_ORG_WITHDRAWLS,
  FETCH_WITHDRAWL,
  EDIT_WITHDRAWL,
  DELETE_WITHDRAWL,
  UPDATE_NOTIFICATION_CENTER_STATUS
} from "./types";
import history from "../../history";
import { createOrg } from "../../ethereum/orgFactoryAdmin";
import { plantFund } from "../../ethereum/fundNursreyAdmin";
import { fundContract, approveFundGrant } from "../../ethereum/fund";
import { orgContract, approveOrgClaim } from "../../ethereum/org";
import BN from "bignumber.js";
import adminWeb3 from "../../ethereum/adminWeb3";

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

//LOCAL DB ACTIONS: FUNDS
export const plantFundAndContract = formValues => async (
  dispatch,
  getState
) => {
  const { account } = getState().web3connect;
  const createdContract = await plantFund(account);
  const response = await localDB.post("/funds", {
    ...formValues,
    managerAddress: account,
    id: createdContract.id,
    fundDAI: "0.00",
    grantableDAI: 0.0
  });

  dispatch({ type: PLANT_FUND, payload: response.data });
  history.push(`/funds/${createdContract.id}`);
};

export const fetchFunds = () => async dispatch => {
  const response = await localDB.get("/funds");

  dispatch({ type: FETCH_FUNDS, payload: response.data });
};

export const fetchUserFunds = address => async dispatch => {
  const allFunds = await localDB.get("/funds");
  const response = allFunds.data.filter(fund => {
    if (fund.managerAddress === address) {
      return { fund };
    }
    return "";
  });

  dispatch({ type: FETCH_FUNDS, payload: response });
};

export const fetchFundDAIBalance = address => async dispatch => {
  const fund = fundContract(address);
  const fundDAIBalance = await fund.methods
    .getSummary(process.env.REACT_APP_STABLECOIN_ADDRESS)
    .call();
  const fundDAI = (
    parseFloat(fundDAIBalance[0]) /
    10 ** process.env.REACT_APP_STABLECOIN_DECIMALS
  ).toFixed(2);

  const response = await localDB.patch(`/funds/${address}`, {
    fundDAI: fundDAI
  });

  dispatch({ type: FETCH_FUND_DAI, payload: response.data });
};

export const fetchGrantableDAIBalance = address => async dispatch => {
  const fund = fundContract(address);
  const fundDAIBalance = await fund.methods
    .getSummary(process.env.REACT_APP_STABLECOIN_ADDRESS)
    .call();
  const fundDAI = (
    parseFloat(fundDAIBalance[0]) /
      10 ** process.env.REACT_APP_STABLECOIN_DECIMALS -
    0.01
  ).toFixed(2);

  const allGrants = await localDB.get("/grants");
  const fundGrants = allGrants.data.filter(grant => {
    if (grant.selectedFund === address && grant.grantApproval === false) {
      return { grant };
    }
    return "";
  });

  const pendingGrants = Object.values(fundGrants).reduce(
    (a, b) => a + (parseFloat(b["grantAmount"]) || 0),
    0
  );
  const grantableDAI = (fundDAI - pendingGrants).toFixed(2);

  const response = await localDB.patch(`/funds/${address}`, {
    grantableDAI: grantableDAI
  });

  dispatch({ type: FETCH_GRANTABLE_DAI, payload: response.data });
};
export const fetchFund = id => async dispatch => {
  const response = await localDB.get(`/funds/${id}`);

  dispatch({ type: FETCH_FUND, payload: response.data });
};

export const editFund = (id, formValues) => async dispatch => {
  const response = await localDB.patch(`/funds/${id}`, formValues);

  dispatch({ type: EDIT_FUND, payload: response.data });
  history.push("/");
};

export const deleteFund = id => async dispatch => {
  await localDB.delete(`/funds/${id}`);

  dispatch({ type: DELETE_FUND, payload: id });
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
      dateApproved: claimDetails.data.claimApprovalDetails.dateApproved,
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

//DB ACTIONS: CLAIMS

export const createOrgClaim = (formValues, id, index, taxID) => async (
  dispatch,
  getState
) => {
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

  dispatch({ type: CREATE_GRANT, payload: response.data });
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

export const fetchFundGrants = address => async dispatch => {
  const allGrants = await localDB.get("/grants");
  const response = allGrants.data.filter(grant => {
    if (grant.selectedFund === address) {
      return { grant };
    }
    return "";
  });

  dispatch({ type: FETCH_FUND_GRANTS, payload: response });
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
  fundAddress,
  fromAddress,
  inputCurrency,
  inputAmount,
  outputAmount,
  outputDecimals
) => async dispatch => {
  const finalTradeOutput = (outputAmount / 10 ** outputDecimals).toFixed(2);
  const response = await localDB.post(`/donations`, {
    id: txID,
    to: fundAddress,
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

export const fetchFundDonations = address => async dispatch => {
  const allDonations = await localDB.get("/donations");
  const response = allDonations.data.filter(donation => {
    if (donation.to === address) {
      return { donation };
    }
    return "";
  });

  dispatch({ type: FETCH_FUND_DONATIONS, payload: response });
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

// DB ACTIONS: WOITHDRAWLS
export const createOrgWithdrawl = (
  selectedOrg,
  orgContractAddress,
  orgAdminWallet
  //   currentOrgContractBalance
) => async dispatch => {
  console.log(orgContractAddress);
  const org = orgContract(orgContractAddress);
  const currentNonce = await adminWeb3.eth.getTransactionCount(
    process.env.REACT_APP_GT_ADMIN,
    "pending"
  );
  const id = await org.methods
    .cashOutOrg(orgAdminWallet, process.env.REACT_APP_STABLECOIN_ADDRESS)
    .send({ from: process.env.REACT_APP_GT_ADMIN, nonce: currentNonce })
    .on("transactionHash", function(transId) {
      console.log(transId);
      return transId;
    });
  const response = await localDB.post(`/withdrawls`, {
    id: id.transactionHash,
    selectedOrg,
    orgAdminWallet
    // withdrawlAmount: currentOrgContractBalance
  });

  dispatch({ type: MAKE_ORG_WITHDRAWL, payload: response.data });
  history.push(`/orgs/${selectedOrg}`);
};

export const fetchWithdrawls = () => async dispatch => {
  const response = await localDB.get("/withdrawls");

  dispatch({ type: FETCH_WITHDRAWLS, payload: response.data });
};

export const fetchOrgWithdrawls = ein => async dispatch => {
  const allWithdrawls = await localDB.get("/withdrawls");
  const response = allWithdrawls.data.filter(withdrawl => {
    if (withdrawl.selectedOrg === ein) {
      return { withdrawl };
    }
    return "";
  });

  dispatch({ type: FETCH_ORG_WITHDRAWLS, payload: response });
};

export const fetchWithdrawl = id => async dispatch => {
  const response = await localDB.get(`/withdrawls/${id}`);

  dispatch({ type: FETCH_WITHDRAWL, payload: response.data });
};

export const editWithdrawl = (id, formValues) => async dispatch => {
  const response = await localDB.patch(`/withdrawls/${id}`, formValues);

  dispatch({ type: EDIT_WITHDRAWL, payload: response.data });
  history.push("/admin");
};

export const deleteWithdrawl = id => async dispatch => {
  await localDB.delete(`/withdrawls/${id}`);

  dispatch({ type: DELETE_WITHDRAWL, payload: id });
  history.push("/admin");
};

export const updateNCStatus = (headline, message, status) => async dispatch => {
  const ncStatus = { headline, message, status };
  dispatch({ type: UPDATE_NOTIFICATION_CENTER_STATUS, payload: ncStatus });
  return;
};
