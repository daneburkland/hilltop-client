const initialState = {
  recording: {},
  isFetchingRecording: null
};

const dashboard = (state = initialState, action) => {
  switch (action.type) {
    case "CANCEL_ADD_HOVER_STEP":
      return {
        ...state,
        isAddingHoverStep: false
      };
    case "FETCH_RECORDING_START":
      return {
        ...state,
        isFetchingRecording: true
      };
    case "FETCH_RECORDING_SUCCESS":
      return {
        ...state,
        recording: action.recording,
        latestResult: action.latestResult,
        isFetchingRecording: false
      };
    case "FETCH_RECORDING_FAILURE":
      return {
        ...state,
        isFetchingRecording: false
      };
    case "UPDATE_RECORDING_START":
      return {
        ...state,
        isUpdatingRecording: true
      };
    case "UPDATE_RECORDING_FAILURE":
      return {
        ...state,
        isUpdatingRecording: false
      };
    case "UPDATE_RECORDING":
      return {
        ...state,
        recording: action.recording,
        isUpdatingRecording: false
      };
    default:
      return { ...state };
  }
};

export default dashboard;
