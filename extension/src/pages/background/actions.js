import { API } from "aws-amplify";

export const toggleRecord = () => {
  return {
    type: "TOGGLE_RECORD"
  };
};

export const addUrl = url => {
  return {
    type: "ADD_URL",
    url
  };
};

export const addEvent = event => ({
  type: "ADD_EVENT",
  event
});

const saveRecordingFailure = response => ({
  type: "SAVE_RECORDING_FAILURE",
  response
});

const saveRecordingSuccess = response => ({
  type: "SAVE_RECORDING_SUCCESS",
  response
});

const initiateSaveRecording = () => ({
  type: "INITIATE_SAVE_RECORDING"
});

export const toggleShowCode = () => ({
  type: "TOGGLE_SHOW_CODE"
});

export const handleAddHoverStep = () => ({
  type: "ADD_HOVER_STEP"
});

export const handleCancelAddHoverStep = () => ({
  type: "CANCEL_ADD_HOVER_STEP"
});

export const addCookies = cookies => ({
  type: "ADD_COOKIES",
  cookies
});

export const handleClearRecording = () => ({ type: "CLEAR_RECORDING" });

export const handleCreateNew = () => ({ type: "CREATE_NEW_RECORDING" });

export const fetchAuthFlowAliased = origin => ({
  type: "FETCH_AUTH_FLOW",
  origin
});

const fetchAuthFlowStart = { type: "FETCH_AUTH_FLOW_START" };
const fetchAuthFlowSuccess = authFlow => ({
  type: "FETCH_AUTH_FLOW_SUCCESS",
  authFlow
});
const fetchAuthFlowFailure = { type: "FETCH_AUTH_FLOW_FAILURE" };
export const fetchAuthFlow = origin => async dispatch => {
  dispatch(fetchAuthFlowStart);
  try {
    const response = await API.get("teams", "/authFlow", {
      queryStringParameters: { origin }
    });
    dispatch(fetchAuthFlowSuccess(response));
  } catch (e) {
    console.error("failed to fetch auth flow", e);
    dispatch(fetchAuthFlowFailure);
  }
};

export const handleSaveRecordingAliased = ({ isAuthFlow }) => ({
  type: "SAVE_RECORDING",
  isAuthFlow
});

export function handleSaveRecording({ isAuthFlow }) {
  return async function(dispatch, getState) {
    dispatch(initiateSaveRecording());
    const {
      dashboard: { recording }
    } = getState();
    try {
      const response = await recording.save({ isAuthFlow });
      dispatch(saveRecordingSuccess(response));
    } catch (err) {
      dispatch(saveRecordingFailure(err));
    }
  };
}

const updateUserSettingsStart = { type: "UPDATE_USER_SETTINGS_START" };
const updateUserSettingsSuccess = userSettings => ({
  type: "UPDATE_USER_SETTINGS_SUCCESS",
  userSettings
});
const updateUserSettingsFailure = { type: "UPDATE_USER_SETTINGS_FAILURE" };
export const toggleCaptureSessionData = { type: "TOGGLE_SESSION_CAPTURE" };
export const updateUserSettingsAliased = { type: "UPDATE_USER_SETTINGS" };
export const updateUserSettings = () => async (dispatch, getState) => {
  dispatch(updateUserSettingsStart);
  const { dashboard } = getState();
  try {
    const { userSettings } = dashboard;
    await API.put("userSettings", "/userSettings", {
      body: userSettings
    });
    dispatch(updateUserSettingsSuccess);
  } catch (e) {
    console.error("Failed to update user settings:");
    console.info(e);
    dispatch(updateUserSettingsFailure);
  }
};

const fetchUserSettingsStart = { type: "FETCH_USER_SETTINGS_START" };
const fetchUserSettingsFailure = { type: "FETCH_USER_SETTINGS_FAILURE" };
export const fetchUserSettingsAliased = { type: "FETCH_USER_SETTINGS" };
const fetchUserSettingsSuccess = response => ({
  type: "FETCH_USER_SETTINGS_SUCCESS",
  userSettings: response
});
export const fetchUserSettings = () => async dispatch => {
  dispatch(fetchUserSettingsStart);
  try {
    const response = await API.get("userSettings", "/userSettings");
    dispatch(fetchUserSettingsSuccess(response));
  } catch (err) {
    dispatch(fetchUserSettingsFailure);
  }
};

export const deleteStep = id => ({
  type: "DELETE_STEP",
  id
});

export const setPopupId = id => ({
  type: "SET_POPUP_ID",
  id
});

export const updateRecordingName = name => ({
  type: "UPDATE_RECORDING_NAME",
  name
});
