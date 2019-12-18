import {
  MAKE_ORG_WITHDRAWL,
  FETCH_WITHDRAWLS,
  FETCH_ORG_WITHDRAWLS,
  FETCH_WITHDRAWL,
  EDIT_WITHDRAWL,
  DELETE_WITHDRAWL
} from "../actions/types";
import _ from "lodash";

export default (state = {}, action) => {
  switch (action.type) {
    case MAKE_ORG_WITHDRAWL:
      return { ...state, [action.payload.id]: action.payload };
    case FETCH_WITHDRAWL:
      return { ...state, [action.payload.id]: action.payload };
    case EDIT_WITHDRAWL:
      return { ...state, [action.payload.id]: action.payload };
    case FETCH_WITHDRAWLS:
      return { ...state, ..._.mapKeys(action.payload, "id") };
    case FETCH_ORG_WITHDRAWLS:
      return { ...state, ..._.mapKeys(action.payload, "id") };
    case DELETE_WITHDRAWL:
      return _.omit(state, action.payload);
    default:
      return state;
  }
};
