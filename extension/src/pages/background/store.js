import { createStore } from "redux";
import { wrapStore } from "react-chrome-redux";
import reducer from "./reducers";

const initialState = {
  dashboard: {
    mode: null,
    events: [],
    steps: []
  }
};

const store = createStore(reducer, initialState);

wrapStore(store, {
  portName: "COUNTING"
});

export default store;
