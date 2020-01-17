import {
  CREATE_GRANT,
  FETCH_GRANTS,
  FETCH_FUND_GRANTS,
  FETCH_ORG_GRANTS,
  FETCH_GRANT,
  EDIT_GRANT,
  DELETE_GRANT
} from "../actions/types";
import _ from "lodash";

export default (state = {}, action) => {
  switch (action.type) {
    case CREATE_GRANT:
      return { ...state, [action.payload.id]: action.payload };
    case FETCH_GRANT:
      return { ...state, [action.payload.id]: action.payload };
    case EDIT_GRANT:
      return { ...state, [action.payload.id]: action.payload };
    case FETCH_GRANTS:
      return { ...state, ..._.mapKeys(action.payload, "id") };
    case FETCH_FUND_GRANTS:
      return { ...state, ..._.mapKeys(action.payload, "id") };
    case FETCH_ORG_GRANTS:
      return { ...state, ..._.mapKeys(action.payload, "id") };
    case DELETE_GRANT:
      return _.omit(state, action.payload);
    default:
      return state;
  }
};
