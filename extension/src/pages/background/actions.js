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

export const handleSaveRecordingAliased = () => ({ type: "SAVE_RECORDING" });

export function handleSaveRecording() {
  return async function(dispatch, getState) {
    // TODO: implement initial save action creator
    console.log("inside action creator");
    dispatch(initiateSaveRecording());
    const { dashboard } = getState();
    try {
      const response = await API.post("notes", "/notes", {
        body: dashboard.steps
      });
      dispatch(saveRecordingSuccess(response));
    } catch (err) {
      console.log("recording save failed:", err);
      dispatch(saveRecordingFailure(err));
    }
  };
}
