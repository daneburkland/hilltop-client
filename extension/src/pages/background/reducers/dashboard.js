import Recording from "../../../classes/Recording";

const initialState = {
  isRecording: null,
  events: [],
  userSettings: {
    captureSessionData: false
  }
};

const dashboard = (state = initialState, action) => {
  switch (action.type) {
    // TODO: I could init a new Recording object here, and then update it in the
    // ADD_EVENT action, then I wouldn't have to do all the resetting
    case "TOGGLE_RECORD":
      return {
        ...state,
        isRecording: !state.isRecording,
        recording: state.recording || new Recording()
      };

    case "ADD_LOCATION_DETAILS":
      // Only capture location details if no steps have been recorded yet,
      // or if location hasn't yet been recorded
      if (!state.location || !state.steps.length) {
        return {
          ...state,
          location: action.locationDetails.locationHref,
          viewport: action.locationDetails.viewport
        };
      } else return { ...state };
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
      // TODO: pull this out into action
      const parseCookies = ({ cookies, location }) =>
        cookies[0].value.split(" ").map(cookieString => {
          const arr = cookieString.split("=");
          return {
            name: arr[0],
            url: location,
            value: arr[1].substring(0, arr[1].length - 1)
          };
        });
      if (state.userSettings.captureSessionData) {
        return {
          ...state,
          cookies: parseCookies({
            cookies: action.cookies,
            location: state.location
          })
        };
      } else return state;
    case "CREATE_NEW_RECORDING":
      return {
        ...state,
        steps: [],
        cookies: [],
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
    default:
      return { ...state };
  }
};

export default dashboard;
