const initialState = {
  userSettings: {
    captureSessionData: false
  }
};

const dashboard = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_SESSION_CAPTURE":
      return {
        ...state,
        userSettings: {
          ...state.userSettings,
          captureSessionData: !state.userSettings.captureSessionData
        }
      };
    case "UPDATE_USER_SETTINGS_START":
      return {
        ...state,
        isUpdatingUserSettings: true
      };
    case "UPDATE_USER_SETTINGS_SUCCESS":
      return {
        ...state,
        isUpdatingUserSettings: false
      };
    case "UPDATE_USER_SETTINGS_FAILURE":
      return {
        ...state,
        isUpdatingUserSettings: false
      };
    case "FETCH_USER_SETTINGS_START":
      return {
        ...state,
        isFetchingUserSettings: true
      };
    case "FETCH_USER_SETTINGS_SUCCESS":
      return {
        ...state,
        isFetchingUserSettings: false,
        userSettings: action.userSettings
      };
    case "FETCH_USER_SETTINGS_FAILURE":
      return {
        ...state,
        isFetchingUserSettings: false
      };
    default:
      return { ...state };
  }
};

export default dashboard;
