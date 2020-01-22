import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { orgs, org, gtOrgs } from "./orgs";
import funds from "./funds";
import grants from "./grants";
import swapAddresses from "./swapAddresses";
import web3connect from "./web3connect";
import pending from "./pending";
import donations from "./donations";
import claims from "./claims";
import withdrawls from "./withdrawls";
import { ncStatus } from "./ncStatus";

export default combineReducers({
  orgs: orgs,
  org: org,
  addresses: swapAddresses,
  web3connect: web3connect,
  pending: pending,
  form: formReducer,
  gtFunds: funds,
  gtOrgs: gtOrgs,
  gtGrants: grants,
  gtDonations: donations,
  gtClaims: claims,
  gtWithdrawls: withdrawls,
  ncStatus: ncStatus
});
