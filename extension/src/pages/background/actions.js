import { API } from "aws-amplify";

export const toggleRecord = () => ({
  type: "TOGGLE_RECORD"
});

export const addEvent = event => ({
  type: "ADD_EVENT",
  event
});

const saveRecordingFailure = err => ({
  type: "SAVE_RECORDING_FAILURE"
});

const saveRecordingSuccess = response => ({
  type: "SAVE_RECORDING_SUCCESS",
  response
});

const initiateSaveRecording = () => ({
  type: "INITIATE_SAVE_RECORDING"
});

// TODO: dedupe cookies
export const addCookies = cookies => ({ type: "ADD_COOKIES", cookies });

export const handleClearRecording = () => ({ type: "CLEAR_RECORDING" });

export const handleConfirmAuth = () => ({ type: "CONFIRM_AUTH" });

export const handleSaveRecordingAliased = () => ({ type: "SAVE_RECORDING" });

export function handleSaveRecording() {
  return async function(dispatch, getState) {
    dispatch(initiateSaveRecording());
    const { dashboard } = getState();
    try {
      const response = await API.post("notes", "/notes", {
        body: {
          steps: dashboard.steps,
          confirmedHeaders: dashboard.confirmedHeaders
        }
      });
      dispatch(saveRecordingSuccess(response));
    } catch (err) {
      dispatch(saveRecordingFailure(err));
    }
  };
}
