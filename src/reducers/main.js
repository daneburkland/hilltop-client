const initialState = {
  recording: {},
  isFetchingRecording: null
};

const dashboard = (state = initialState, action) => {
  switch (action.type) {
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
