import Recording from "shared/classes/Recording";

// TODO initialState isn't getting loaded
const initialState = {
  isRecording: null,
  events: [],
  recording: new Recording(),
  userSettings: {
    captureSessionData: false
  }
};

const dashboard = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_RECORD":
      return {
        ...state,
        isRecording: !state.isRecording
      };

    case "ADD_URL":
      // Only capture location details if no steps have been recorded yet,
      // or if location hasn't yet been recorded
      const { url } = action;
      return {
        ...state,
        recording: state.recording.addUrl(url)
      };
    case "ADD_EVENT":
      const { event } = action;
      // TODO add this along with capture viewport to the addEvent action
      let hoverStepState = {};
      if (state.isAddingHoverStep) {
        hoverStepState.isAddingHoverStep = false;
      }
      return {
        ...state,
        recording: state.recording.addEvent(event),
        ...hoverStepState
      };
    case "CLEAR_RECORDING":
      return {
        ...state,
        recording: new Recording(),
        saveFailure: null
      };
    case "TOGGLE_SHOW_CODE":
      return {
        ...state,
        showCode: !state.showCode
      };
    case "ADD_COOKIES":
      return {
        ...state,
        recording: state.recording.addCookies(action.cookies)
      };
    case "CREATE_NEW_RECORDING":
      return {
        ...state,
        recording: new Recording(),
        saveSuccess: null,
        location: null,
        viewport: null
      };
    case "INITIATE_SAVE_RECORDING":
      return {
        ...state,
        isSaving: true
      };
    case "SAVE_RECORDING_SUCCESS":
      return {
        ...state,
        saveSuccess: true,
        isSaving: false
      };
    case "SAVE_RECORDING_FAILURE":
      return {
        ...state,
        saveFailure: true,
        isSaving: false,
        response: action.response
      };
    case "ADD_HOVER_STEP":
      return {
        ...state,
        isAddingHoverStep: true
      };
    case "FETCH_USER_SETTINGS_SUCCESS":
      return {
        recording: state.recording.addCaptureSession(
          action.userSettings.captureSessionData
        ),
        ...state
      };
    default:
      return { ...state };
  }
};

export default dashboard;
