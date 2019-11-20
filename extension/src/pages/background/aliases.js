import {
  handleSaveRecording,
  updateUserSettings,
  fetchUserSettings,
  fetchAuthFlow
} from "./actions";

export default {
  SAVE_RECORDING: handleSaveRecording,
  UPDATE_USER_SETTINGS: updateUserSettings,
  FETCH_USER_SETTINGS: fetchUserSettings,
  FETCH_AUTH_FLOW: fetchAuthFlow
};
