import { UPDATE_APP_TAB } from "../actions/types";

export const appTab = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_APP_TAB:
      return action.payload;
    default:
      return state;
  }
};
