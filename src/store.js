import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import reducer from "./reducers";

const loggerMiddleware = createLogger();

const initialState = {};

const store = createStore(
  reducer,
  initialState,
  applyMiddleware(thunkMiddleware, loggerMiddleware)
);

export default store;
