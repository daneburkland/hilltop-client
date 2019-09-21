import { updateSteps } from "../../utils";

const initialState = {
  isRecording: null,
  events: []
};

const dashboard = (state = initialState, action) => {
  console.log("action:", action);
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
      return {
        ...state,
        events,
        steps
      };
    case "SAVE_RECORDING":
      // TODO: implement save
      return {
        ...state
      };
  }
  return state;
};

export default dashboard;
