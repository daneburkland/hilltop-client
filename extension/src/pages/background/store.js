import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import { createStore, applyMiddleware } from "redux";
import { wrapStore, alias } from "webext-redux";
import reducer from "./reducers";
import aliases from "./aliases";
import Recording from "shared/classes/Recording";

const loggerMiddleware = createLogger();

const initialState = {
  dashboard: {
    isRecording: null,
    recording: new Recording(),
    showCode: false,
    userSettings: {}
  }
};

const store = createStore(
  reducer,
  initialState,
  applyMiddleware(alias(aliases), thunkMiddleware, loggerMiddleware)
);

wrapStore(store, {
  portName: "COUNTING"
});

export default store;
