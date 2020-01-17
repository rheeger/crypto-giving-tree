import {
  EXTEND_GRANT,
  PLANT_FUND,
  FETCH_FUNDS,
  FETCH_FUND,
  FETCH_FUND_DAI,
  FETCH_GRANTABLE_DAI,
  EDIT_FUND,
  DELETE_FUND
} from "../actions/types";
import _ from "lodash";

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_FUND:
      return { ...state, [action.payload.id]: action.payload };
    case FETCH_FUND_DAI:
      return { ...state, [action.payload.id]: action.payload };
    case FETCH_GRANTABLE_DAI:
      return { ...state, [action.payload.id]: action.payload };
    case PLANT_FUND:
      return { ...state, [action.payload.id]: action.payload };
    case EXTEND_GRANT:
      return { ...state, [action.payload.id]: action.payload };
    case EDIT_FUND:
      return { ...state, [action.payload.id]: action.payload };
    case FETCH_FUNDS:
      return { ..._.mapKeys(action.payload, "id") };
    case DELETE_FUND:
      return _.omit(state, action.payload);
    default:
      return state;
  }
};
