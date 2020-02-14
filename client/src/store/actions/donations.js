import * as types from "./types";
import localDB from "../../helpers/apis/localDB";
import history from "../../history";
import _ from "lodash";

//ACTIONS: DONATIONS
export const createDonation = (
  txID,
  fundAddress,
  fromAddress,
  inputCurrency,
  inputAmount,
  finalTradeOutput,
  transStatus
) => async dispatch => {
  const response = await localDB.post(
    `/${process.env.REACT_APP_ETHERSCAN_PREFIX}donations`,
    {
      id: txID,
      to: fundAddress,
      from: fromAddress,
      inputCurrency,
      inputAmount,
      finalTradeOutput,
      transStatus
    }
  );

  dispatch({ type: types.CREATE_DONATION, payload: response.data });
};

export const fetchDonations = () => async dispatch => {
  const response = await localDB.get(
    `/${process.env.REACT_APP_ETHERSCAN_PREFIX}donations`
  );

  dispatch({ type: types.FETCH_DONATIONS, payload: response.data });
};

export const fetchFundDonations = fund => async dispatch => {
  const response = await localDB.get(
    `/${process.env.REACT_APP_ETHERSCAN_PREFIX}donations/${fund}`
  );

  dispatch({ type: types.FETCH_FUND_DONATIONS, payload: response.data });
};

export const fetchDonation = id => async dispatch => {
  const response = await localDB.get(
    `/${process.env.REACT_APP_ETHERSCAN_PREFIX}donations/${id}`
  );

  dispatch({ type: types.FETCH_DONATION, payload: response.data });
};

export const finalizeDonation = (
  id,
  finalTradeOutput,
  transStatus
) => async dispatch => {
  const response = await localDB.patch(
    `/${process.env.REACT_APP_ETHERSCAN_PREFIX}donations/${id}`,
    {
      finalTradeOutput,
      transStatus
    }
  );

  dispatch({ type: types.EDIT_DONATION, payload: response.data });
  if (transStatus === "complete") {
    _.delay(function() {
      window.location.reload();
    }, 2000);
  }
};

export const deleteDonation = id => async dispatch => {
  await localDB.delete(
    `/${process.env.REACT_APP_ETHERSCAN_PREFIX}donations/${id}`
  );

  dispatch({ type: types.DELETE_DONATION, payload: id });
  history.push("/");
};
