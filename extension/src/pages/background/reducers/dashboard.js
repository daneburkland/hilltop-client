import EventRecorder from "../../EventRecorder";

const initialState = {
  isRecording: null,
  events: []
};

const dashboard = (state = initialState, action) => {
  switch (action.type) {
    // TODO: I could init a new Recording object here, and then update it in the
    // ADD_EVENT action
    case "TOGGLE_RECORD":
      return {
        ...state,
        isRecording: !state.isRecording
      };
    case "ADD_EVENT":
      const events = [...state.events, action.event];
      const { event } = action;
      // TODO: use an `updateRecording` method, which updates steps, code, and
      // only resets location if !events.length
      const steps = EventRecorder.updateSteps({ event, steps: state.steps });
      const location = events[0].target.baseURI;
      const puppeteerCode = EventRecorder.generatePuppeteerCode({
        steps,
        location
      });
      return {
        ...state,
        events,
        steps,
        puppeteerCode,
        location
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
    case "CANCEL_ADD_HOVER_STEP":
      return {
        ...state,
        isAddingHoverStep: false
      };
    default:
      return { ...state };
  }
};

export default dashboard;
