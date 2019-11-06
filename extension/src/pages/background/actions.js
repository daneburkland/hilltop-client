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

export const handleSaveRecordingAliased = () => ({ type: "SAVE_RECORDING" });

export function handleSaveRecording() {
  return async function(dispatch, getState) {
    dispatch(initiateSaveRecording());
    const {
      dashboard: { recording }
    } = getState();
    try {
      const response = await recording.save();
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
