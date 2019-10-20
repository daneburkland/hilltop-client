import { combineReducers } from "redux";
import dashboard from "./reducers/dashboard";
import userSettings from "./reducers/userSettings";

export default combineReducers({
  dashboard,
  userSettings
});
