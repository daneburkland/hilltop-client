import "core-js/stable";
import "regenerator-runtime/runtime";
import store from "./store";
import Amplify from "aws-amplify";
import config from "shared/config";
import { parseAuth } from "./webRequest";
import { addUrl } from "./actions";

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
        name: "recordings",
        endpoint: config.apiGateway.recordings.URL,
        region: config.apiGateway.recordings.REGION
      },
      {
        name: "userSettings",
        endpoint: config.apiGateway.userSettings.URL,
        region: config.apiGateway.userSettings.REGION
      }
    ]
  }
});

let isRecording = null;
async function handleUrlCapture() {
  if (!store.getState().dashboard.isRecording) isRecording = false;
  if (!isRecording && store.getState().dashboard.isRecording) {
    await chrome.tabs.query(
      {
        active: true,
        currentWindow: true
      },
      ([currentTab]) => {
        isRecording = true;
        store.dispatch(addUrl(currentTab.url));
      }
    );
  }
}

store.subscribe(handleUrlCapture);

// TODO: performance?
chrome.webRequest.onBeforeSendHeaders.addListener(
  // details => console.log(details),
  details => parseAuth(details, store),
  { urls: ["<all_urls>"] },
  ["requestHeaders", "extraHeaders"]
);

let popupId = null;
function openOrFocusPopup(request) {
  if (popupId) {
    chrome.windows.update(popupId, { focused: true });
  } else {
    chrome.windows.create(
      {
        url: "/pages/popup.html",
        type: "popup",
        width: 1200,
        height: 600
      },
      ({ id }) => {
        popupId = id;
      }
    );
  }
}

chrome.browserAction.onClicked.addListener(openOrFocusPopup);
