import * as types from "./types";

export const updateNCStatus = (headline, message, status) => async dispatch => {
  const ncStatus = { headline, message, status };
  dispatch({
    type: types.UPDATE_NOTIFICATION_CENTER_STATUS,
    payload: ncStatus
  });
  return;
};
