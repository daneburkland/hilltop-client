import "bootstrap/dist/css/bootstrap.min.css";
// import "../../css/bootstrap4-business-tycoon.min.css";
import "core-js/stable";
import "regenerator-runtime/runtime";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Store } from "webext-redux";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import config from "shared/config";
import Amplify from "aws-amplify";

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  },
  Storage: {
    region: config.s3.REGION,
    bucket: config.s3.BUCKETS.SCREENSHOTS,
    identityPoolId: config.cognito.IDENTITY_POOL_ID
  },
  API: {
    endpoints: [
      {
        name: "recordings",
        endpoint: config.apiGateway.recordings.URL,
        region: config.apiGateway.recordings.REGION
      },
      {
        name: "teams",
        endpoint: config.apiGateway.teams.URL,
        region: config.apiGateway.teams.REGION
      },
      {
        name: "users",
        endpoint: config.apiGateway.users.URL,
        region: config.apiGateway.users.REGION
      }
    ]
  }
});

const store = new Store({
  portName: "COUNTING"
});

store.ready().then(() => {
  const mountNode = document.createElement("div");
  document.body.appendChild(mountNode);

  ReactDOM.render(
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>,
    mountNode
  );
});
