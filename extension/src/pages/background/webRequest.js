import { addCookies } from "./actions";

export function parseAuth({ type, requestHeaders }, { dispatch }) {
  if (type === "main_frame") {
    const cookies = requestHeaders.filter(header => header.name === "Cookie");
    // TODO: Authorization?
    const auth = requestHeaders.filter(
      header => header.name === "Authorization"
    );
    if (cookies.length) {
      dispatch(addCookies(cookies));
    }
    if (auth.length) {
      console.log("auth", auth);
    }
  }
}
