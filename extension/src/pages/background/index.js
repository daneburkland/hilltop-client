import "core-js/stable";
import "regenerator-runtime/runtime";
import store from "./store";
import Amplify from "aws-amplify";
import config from "shared/config";
import { parseAuth } from "./webRequest";

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
    bucket: config.s3.BUCKET,
    identityPoolId: config.cognito.IDENTITY_POOL_ID
  },
  API: {
    endpoints: [
      {
        name: "notes",
        endpoint: config.apiGateway.notes.URL,
        region: config.apiGateway.notes.REGION
      }
    ]
  }
});

// TODO: performance?
chrome.webRequest.onBeforeSendHeaders.addListener(
  // details => console.log(details),
  details => parseAuth(details, store),
  { urls: ["<all_urls>"] },
  ["requestHeaders", "extraHeaders"]
);
