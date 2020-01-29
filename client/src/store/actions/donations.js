import * as types from "./types";
import localDB from "../../helpers/apis/localDB";
import history from "../../history";

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
  const response = await localDB.post(`/donations`, {
    id: txID,
    to: fundAddress,
    from: fromAddress,
    inputCurrency,
    inputAmount,
    finalTradeOutput,
    transStatus
  });

  dispatch({ type: types.CREATE_DONATION, payload: response.data });
};

export const fetchDonations = () => async dispatch => {
  const response = await localDB.get("/donations");

  dispatch({ type: types.FETCH_DONATIONS, payload: response.data });
};

export const fetchFundDonations = address => async dispatch => {
  const allDonations = await localDB.get("/donations");
  const response = allDonations.data.filter(donation => {
    if (donation.to === address) {
      return { donation };
    }
    return "";
  });

  dispatch({ type: types.FETCH_FUND_DONATIONS, payload: response });
};

export const fetchDonation = id => async dispatch => {
  const response = await localDB.get(`/donations/${id}`);

  dispatch({ type: types.FETCH_DONATION, payload: response.data });
};

export const finalizeDonation = (
  id,
  finalTradeOutput,
  transStatus
) => async dispatch => {
  const response = await localDB.patch(`/donations/${id}`, {
    finalTradeOutput,
    transStatus
  });

  dispatch({ type: types.EDIT_DONATION, payload: response.data });
};

export const deleteDonation = id => async dispatch => {
  await localDB.delete(`/donations/${id}`);

  dispatch({ type: types.DELETE_DONATION, payload: id });
  history.push("/");
};
