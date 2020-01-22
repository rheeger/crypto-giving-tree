import { UPDATE_NOTIFICATION_CENTER_STATUS } from "../actions/types";

export const ncStatus = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_NOTIFICATION_CENTER_STATUS:
      return action.payload;
    default:
      return state;
  }
};
