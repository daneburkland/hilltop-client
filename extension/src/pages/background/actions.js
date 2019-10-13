import { API } from "aws-amplify";

export const toggleRecord = () => {
  return {
    type: "TOGGLE_RECORD"
  };
};

export const addLocationDetails = locationDetails => {
  return {
    type: "ADD_LOCATION_DETAILS",
    locationDetails
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

// TODO: dedupe cookies
export const addCookies = cookies => ({ type: "ADD_COOKIES", cookies });

export const handleClearRecording = () => ({ type: "CLEAR_RECORDING" });

export const handleConfirmAuth = () => ({ type: "CONFIRM_AUTH" });

export const handleCreateNew = () => ({ type: "CREATE_NEW_RECORDING" });

export const handleSaveRecordingAliased = () => ({ type: "SAVE_RECORDING" });

export function handleSaveRecording() {
  return async function(dispatch, getState) {
    dispatch(initiateSaveRecording());
    const { dashboard } = getState();
    try {
      const { steps, location, puppeteerCode, code } = dashboard;
      const response = await API.post("notes", "/notes", {
        body: {
          steps,
          location,
          puppeteerCode,
          code
        }
      });
      dispatch(saveRecordingSuccess(response));
    } catch (err) {
      dispatch(saveRecordingFailure(err));
    }
  };
}
