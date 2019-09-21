import { updateSteps } from "../../utils";

const initialState = {
  mode: null,
  events: []
};

const dashboard = (state = initialState, action) => {
  console.log("dashboard action:", action, "current state:", state);
  switch (action.type) {
    case "TOGGLE_MODE":
      return {
        ...state,
        mode: action.mode
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
  }
  return state;
};

export default dashboard;
