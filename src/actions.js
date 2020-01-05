import { API } from "aws-amplify";
import axios from "axios";
import config from "shared/config";

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
    const { noteId, code } = recording;
    const response = await API.post("recordingTests", "/add", {
      body: {
        noteId,
        code
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
    const response = await API.post("recordingTests", "/pause", {
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

export const handleRunTest = () => async (dispatch, getState) => {
  const { main } = getState();
  const { recording } = main;
  try {
    const response = await axios({
      method: "POST",
      url: `${config.hilltopChromeUrlLocal}/function`,
      mode: "no-cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json"
      },
      timeout: 25000,
      data: { code: recording.code, context: { cookies: recording.cookies } }
    });

    console.log("response", response);

    // figure out how to run test
  } catch (err) {
    // dispatch and error
    console.error(err);
  }
};
