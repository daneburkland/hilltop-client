import React, { useState, useEffect } from "react";
import AceEditor from "react-ace";
import { API } from "aws-amplify";

import "brace/mode/javascript";
import "brace/theme/monokai";

const hostname = "localhost";
const port = "8888";

const devToolsUrl = `http://${hostname}:${
  port ? `${port}` : ""
}/devtools/inspector.html`;

function addCookieContext({ value, cookies }) {
  let lines = value.split("\n");
  const setCookies = `await page.setCookie(${cookies.map(cookie =>
    JSON.stringify(cookie)
  )});`;
  lines.splice(1, 0, setCookies);
  lines = lines.join("\n");
  return lines;
}

function addCookieToDocument(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function Editor({ match }) {
  const secure = false;
  const wsLocation = `${hostname}${port ? `:${port}` : ""}/debugger`;
  const debugUrlInitial = `${devToolsUrl}?${
    secure ? "wss" : "ws"
  }=${wsLocation}`;

  const [editorValue, setEditorValue] = useState("");
  const [fetchedCode, setFetchedCode] = useState(null);
  const [cookies, setCookies] = useState([]);
  const [refreshIframeCount, setRefreshIframeCount] = useState(0);

  const fetchAndSetData = async () => {
    const { debugCode, cookies } = await API.get(
      "notes",
      `/notes/${match.params.id}`
    );
    setEditorValue(debugCode);
    setCookies(cookies);
    setFetchedCode(true);
  };

  const loadIframe = () => {
    const withCookies = addCookieContext({ value: editorValue, cookies });
    const stringifiedCode = encodeURIComponent(`${withCookies}`);
    addCookieToDocument("hilltop_code", stringifiedCode, 1);
    setRefreshIframeCount(refreshIframeCount + 1);
  };

  useEffect(() => {
    if (!!match.params.id) {
      fetchAndSetData();
    }
  }, []);

  useEffect(() => {
    loadIframe();
  }, [fetchedCode]);

  return (
    // TODO: figure out better style
    <div className="d-flex" style={{ height: `calc(100vh - 52px)` }}>
      <AceEditor
        height="inherit"
        wrapEnabled
        mode="javascript"
        theme="monokai"
        onChange={value => setEditorValue(value)}
        value={editorValue}
      />
      <button onClick={loadIframe}>Run</button>
      <iframe
        title="playground"
        className="flex-grow-1"
        key={refreshIframeCount}
        src={debugUrlInitial}
      />
    </div>
  );
}

export default Editor;
