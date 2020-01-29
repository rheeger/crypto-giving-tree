import * as types from "./types";

export const updateAppTab = tab => async dispatch => {
  const appTab = tab;
  dispatch({
    type: types.UPDATE_APP_TAB,
    payload: appTab
  });
  return;
};
