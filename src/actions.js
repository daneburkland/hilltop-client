import { API } from "aws-amplify";
import config from "shared/config";

const fetchRecordingSuccess = recording => ({
  type: "FETCH_RECORDING_SUCCESS",
  recording
});

const fetchRecordingFailure = error => ({
  type: "FETCH_RECORDING_FAILURE",
  error
});

const fetchRecordingStart = { type: "FETCH_RECORDING_START" };

export const handleFetchRecording = id => async dispatch => {
  dispatch(fetchRecordingStart);
  try {
    const recording = await API.get("notes", `/notes/${id}`);
    dispatch(fetchRecordingSuccess(recording));
  } catch (err) {
    dispatch(fetchRecordingFailure(err));
  }
};

const updateRecordingSuccess = recording => ({
  type: "UPDATE_RECORDING",
  recording
});

const updateRecordingStart = { type: "UPDATE_RECORDING_START" };
const updateRecordingFailure = { type: "UPDATE_RECORDING_FAILURE" };

export const handleScheduleTest = () => async (dispatch, getState) => {
  try {
    dispatch(updateRecordingStart);
    const { main } = getState();
    const { recording } = main;
    const { noteId, testCode } = recording;
    const response = await API.post("recordingTasks", "/add", {
      body: {
        noteId,
        testCode
      }
    });
    console.log("Success scheduling recording:");
    dispatch(updateRecordingSuccess(response));
  } catch (e) {
    dispatch(updateRecordingFailure);
    console.log("Error scheduling recording:", e);
  }
};

export const handlePauseTest = () => async (dispatch, getState) => {
  try {
    dispatch(updateRecordingStart);
    const { main } = getState();
    const { recording } = main;
    const { noteId } = recording;
    const response = await API.post("recordingTasks", "/pause", {
      body: {
        noteId
      }
    });
    console.log("Success scheduling recording:");
    dispatch(updateRecordingSuccess(response));
  } catch (e) {
    dispatch(updateRecordingFailure);
    console.log("Error scheduling recording:", e);
  }
};

export const handleRunTest = code => async dispatch => {
  console.log(code);
  const body = {
    code
  };
  try {
    const response = await fetch(`${config.hilltopChromeUrl}/function`, {
      method: "POST",
      // TODO: why does `no-cors` cause the body object to stringify
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json"
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(body)
    });

    console.log(response);

    // figure out how to run test
  } catch (err) {
    // dispatch and error
    console.error(err);
  }
};
