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
      const puppeteerCode = generatePuppeteerCode({
        steps,
        location: state.location,
        confirmedHeaders: state.confirmedHeaders
      });
      return {
        ...state,
        events,
        steps,
        puppeteerCode
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
    case "LOCATION_CAPTURED":
      const { location } = action;
      return {
        ...state,
        location,
        locationCaptured: true
      };
    default:
      return { ...state };
  }
};

export default dashboard;
