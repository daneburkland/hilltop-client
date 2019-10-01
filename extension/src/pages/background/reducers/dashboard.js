import EventRecorder from "../../EventRecorder";

const initialState = {
  isRecording: null,
  events: []
};

const dashboard = (state = initialState, action) => {
  switch (action.type) {
    // TODO: I could init a new Recording object here, and then update it in the
    // ADD_EVENT action, then I wouldn't have to do all the resetting
    case "TOGGLE_RECORD":
      return {
        ...state,
        isRecording: !state.isRecording
      };
    case "ADD_EVENT":
      const events = [...state.events, action.event];
      const { event } = action;
      // TODO add this along with capture viewport to the addEvent action
      let manualStepState = {};
      if (state.isAddingHoverStep) {
        manualStepState.isAddingHoverStep = false;
      }
      const {
        steps,
        location,
        puppeteerCode,
        jestCode
      } = EventRecorder.updateSteps({
        event,
        steps: state.steps
      });
      return {
        ...state,
        events,
        steps,
        puppeteerCode,
        location,
        jestCode,
        ...manualStepState
      };
    case "CLEAR_RECORDING":
      return {
        ...state,
        steps: [],
        events: [],
        cookies: [],
        location: null,
        puppeteerCode: ""
      };
    case "TOGGLE_SHOW_CODE":
      return {
        ...state,
        showCode: !state.showCode
      };
    case "ADD_COOKIES":
      return {
        ...state,
        cookies: action.cookies
      };
    case "CREATE_NEW_RECORDING":
      return {
        ...state,
        steps: [],
        cookies: [],
        puppeteerCode: "",
        saveSuccess: null
      };
    case "CONFIRM_AUTH":
      return {
        ...state,
        confirmedHeaders: { cookies: state.cookies, auth: state.auth },
        cookies: [],
        auth: []
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
