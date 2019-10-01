import { API } from "aws-amplify";
import { hilltopChromeUrl } from "./libs/api";

const fetchRecordingSuccess = recording => ({
  type: "FETCH_RECORDING_SUCCESS",
  recording
});

const fetchRecordingFailure = error => ({
  type: "FETCH_RECORDING_FAILURE",
  error
});

export const handleFetchRecording = id => async dispatch => {
  try {
    const recording = await API.get("notes", `/notes/${id}`);
    dispatch(fetchRecordingSuccess(recording));
  } catch (err) {
    dispatch(fetchRecordingFailure(err));
  }
};

export const handleRunTest = code => async dispatch => {
  console.log(code);
  const body = {
    code
  };
  try {
    const response = await fetch(`${hilltopChromeUrl}/function`, {
      method: "POST",
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
  }
};
