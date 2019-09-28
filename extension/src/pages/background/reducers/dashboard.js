import { updateSteps, generatePuppeteerCode } from "../../utils";

const initialState = {
  isRecording: null,
  events: []
};

const dashboard = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_RECORD":
      return {
        ...state,
        isRecording: !state.isRecording
      };
    case "ADD_EVENT":
      const events = [...state.events, action.event];
      const { event } = action;
      const steps = updateSteps({ event, steps: state.steps });
      const location = events[0].target.baseURI;
      const puppeteerCode = generatePuppeteerCode({
        steps,
        location,
        confirmedHeaders: state.confirmedHeaders
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
        cookies: [],
        locationCaptured: false,
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
        locationCaptured: false,
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
        isSaving: false,
        locationCaptured: false
      };
    default:
      return { ...state };
  }
};

export default dashboard;
