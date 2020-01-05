import "bootstrap/dist/css/bootstrap.min.css";
// import "./css/bootstrap4-business-tycoon.min.css";
import "core-js/stable";
import "regenerator-runtime/runtime";
import React from "react";
import ReactDOM from "react-dom";
import Amplify from "aws-amplify";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import config from "shared/config";
import { Provider } from "react-redux";
import store from "./store";

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
        name: "recordingTests",
        endpoint: config.apiGateway.recordingTests.URL,
        region: config.apiGateway.recordingTests.REGION
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

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
