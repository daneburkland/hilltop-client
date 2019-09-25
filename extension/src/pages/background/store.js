import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import { createStore, applyMiddleware } from "redux";
import { wrapStore, alias } from "react-chrome-redux";
import reducer from "./reducers";
import aliases from "./aliases";

const loggerMiddleware = createLogger();

const initialState = {
  dashboard: {
    isRecording: null,
    events: [],
    steps: [],
    cookies: [],
    showCode: false
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
