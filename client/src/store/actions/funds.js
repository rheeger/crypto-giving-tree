import * as types from "./types";
import localDB from "../../helpers/apis/localDB";
import history from "../../history";
import { plantFund } from "../../ethereum/fundNursreyAdmin";
import { fundContract } from "../../ethereum/fund";

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

  dispatch({ type: types.PLANT_FUND, payload: response.data });
  history.push(`/funds/${createdContract.id}`);
};

export const fetchFunds = () => async dispatch => {
  const response = await localDB.get("/funds");

  dispatch({ type: types.FETCH_FUNDS, payload: response.data });
};

export const fetchUserFunds = address => async dispatch => {
  const allFunds = await localDB.get("/funds");
  const response = allFunds.data.filter(fund => {
    if (fund.managerAddress === address) {
      return { fund };
    }
    return "";
  });

  dispatch({ type: types.FETCH_FUNDS, payload: response });
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

  dispatch({ type: types.FETCH_FUND_DAI, payload: response.data });
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

  dispatch({ type: types.FETCH_GRANTABLE_DAI, payload: response.data });
};
export const fetchFund = id => async dispatch => {
  const response = await localDB.get(`/funds/${id}`);

  dispatch({ type: types.FETCH_FUND, payload: response.data });
};

export const editFund = (id, formValues) => async dispatch => {
  const response = await localDB.patch(`/funds/${id}`, formValues);

  dispatch({ type: types.EDIT_FUND, payload: response.data });
  history.push("/");
};

export const deleteFund = id => async dispatch => {
  await localDB.delete(`/funds/${id}`);

  dispatch({ type: types.DELETE_FUND, payload: id });
  history.push("/");
};
