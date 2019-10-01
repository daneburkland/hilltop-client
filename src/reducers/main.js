const initialState = {};

const dashboard = (state = initialState, action) => {
  switch (action.type) {
    case "CANCEL_ADD_HOVER_STEP":
      return {
        ...state,
        isAddingHoverStep: false
      };
    case "FETCH_RECORDING_SUCCESS":
      return {
        ...state,
        recording: action.recording
      };
    default:
      return { ...state };
  }
};

export default dashboard;
