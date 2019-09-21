import React, { Component } from "react";
import RecorderContainer from "./RecorderContainer";
import { render } from "react-dom";
import "./index.css";
import { Store } from "react-chrome-redux";
import { Provider } from "react-redux";

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
