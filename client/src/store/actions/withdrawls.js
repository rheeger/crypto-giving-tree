import * as types from "./types";
import localDB from "../../helpers/apis/localDB";
import { orgContract } from "../../ethereum/org";
import adminWeb3 from "../../ethereum/adminWeb3";
import history from "../../history";

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
    .cashOutOrg(
      orgAdminWallet,
      process.env.REACT_APP_STABLECOIN_ADDRESS,
      process.env.REACT_APP_ENDAOMENT_ADMIN
    )
    .send({ from: process.env.REACT_APP_GT_ADMIN, nonce: currentNonce })
    .on("transactionHash", function(transId) {
      console.log(transId);
      return transId;
    });
  const withdrawlAmount =
    id.events.cashOutComplete.returnValues.cashOutAmount /
    10 ** process.env.REACT_APP_STABLECOIN_DECIMALS;
  const response = await localDB.post(`/withdrawls`, {
    id: id.transactionHash,
    selectedOrg,
    orgAdminWallet,
    withdrawlAmount: withdrawlAmount
  });

  dispatch({ type: types.MAKE_ORG_WITHDRAWL, payload: response.data });
  history.push(`/orgs/${selectedOrg}`);
};

export const fetchWithdrawls = () => async dispatch => {
  const response = await localDB.get("/withdrawls");

  dispatch({ type: types.FETCH_WITHDRAWLS, payload: response.data });
};

export const fetchOrgWithdrawls = ein => async dispatch => {
  const allWithdrawls = await localDB.get("/withdrawls");
  const response = allWithdrawls.data.filter(withdrawl => {
    if (withdrawl.selectedOrg === ein) {
      return { withdrawl };
    }
    return "";
  });

  dispatch({ type: types.FETCH_ORG_WITHDRAWLS, payload: response });
};

export const fetchWithdrawl = id => async dispatch => {
  const response = await localDB.get(`/withdrawls/${id}`);

  dispatch({ type: types.FETCH_WITHDRAWL, payload: response.data });
};

export const editWithdrawl = (id, formValues) => async dispatch => {
  const response = await localDB.patch(`/withdrawls/${id}`, formValues);

  dispatch({ type: types.EDIT_WITHDRAWL, payload: response.data });
  history.push("/admin");
};

export const deleteWithdrawl = id => async dispatch => {
  await localDB.delete(`/withdrawls/${id}`);

  dispatch({ type: types.DELETE_WITHDRAWL, payload: id });
  history.push("/admin");
};
