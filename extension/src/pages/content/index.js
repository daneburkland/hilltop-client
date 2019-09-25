import React, { Component } from "react";
import RecorderContainer from "./RecorderContainer";
import { render } from "react-dom";
import "./index.css";
import { Store } from "react-chrome-redux";
import { Provider } from "react-redux";
import { locationCaptured } from "../background/actions";

const store = new Store({
  portName: "COUNTING"
});

export default class InjectApp extends Component {
  render() {
    return <RecorderContainer />;
  }
}

store.ready().then(() => {
  const injectDOM = document.createElement("div");
  injectDOM.className = "inject-react";
  injectDOM.style.textAlign = "center";
  document.body.appendChild(injectDOM);
  render(
    <Provider store={store}>
      <InjectApp />
    </Provider>,
    injectDOM
  );
});

// TODO: baseUri is available on NamedNodeMap items...
function getUrl() {
  const { dashboard } = store.getState();
  if (dashboard.isRecording && !dashboard.locationCaptured) {
    const recordingLocation = window.location;
    store.dispatch(locationCaptured(recordingLocation));
  }
}

store.subscribe(getUrl);
