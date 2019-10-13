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
      const events = [...state.events, action.event];
      const { event } = action;
      // TODO add this along with capture viewport to the addEvent action
      let hoverStepState = {};
      if (state.isAddingHoverStep) {
        hoverStepState.isAddingHoverStep = false;
      }

      const locationState = !state.events.length
        ? {
            viewport: event.viewport,
            location: event.location
          }
        : { viewport: state.viewport, location: state.location };

      const { steps, puppeteerCode, code } = EventRecorder.updateSteps({
        event,
        steps: state.steps,
        ...locationState
      });
      return {
        ...state,
        events,
        steps,
        puppeteerCode,
        code,
        ...locationState,
        ...hoverStepState
      };
    case "CLEAR_RECORDING":
      return {
        ...state,
        steps: [],
        events: [],
        cookies: [],
        location: null,
        viewport: null,
        puppeteerCode: "",
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
        cookies: action.cookies
      };
    case "CREATE_NEW_RECORDING":
      return {
        ...state,
        steps: [],
        cookies: [],
        puppeteerCode: "",
        saveSuccess: null,
        location: null,
        viewport: null
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
