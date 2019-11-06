import { addCookies } from "./actions";

export function parseAuth({ type, requestHeaders }, { dispatch, getState }) {
  if (type === "main_frame") {
    console.log(requestHeaders);
    const cookies = requestHeaders.filter(header => header.name === "Cookie");
    const auth = requestHeaders.filter(
      header => header.name === "Authorization"
    );
    const { dashboard } = getState();
    if (cookies.length && dashboard.isRecording) {
      dispatch(addCookies(cookies));
    }
    if (auth.length) {
      console.log("auth", auth);
    }
  }
}
