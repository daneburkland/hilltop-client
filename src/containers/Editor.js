import React, { useState, useEffect } from "react";
import AceEditor from "react-ace";
import { API } from "aws-amplify";
import config from "shared/config";

import "brace/mode/javascript";
import "brace/theme/monokai";

const dev = true;

const hilltopChromeUrl = dev
  ? "http://localhost:8888"
  : config.hilltopChromeUrl;
const devToolsUrl = `${hilltopChromeUrl}/devtools/inspector.html`;

const hilltopChromeDomain = dev ? "localhost:8888" : config.hilltopChromeDomain;
const wsLocation = `${hilltopChromeDomain}/debugger;`;
const debugUrlInitial = `${devToolsUrl}?${dev ? "ws" : "wss"}=${wsLocation}`;

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
  const [editorValue, setEditorValue] = useState("");
  const [fetchedCode, setFetchedCode] = useState(null);
  const [cookies, setCookies] = useState([]);
  const [refreshIframeCount, setRefreshIframeCount] = useState(0);

  const fetchAndSetData = async () => {
    const { debugCode, authedCookies } = await API.get(
      "recordings",
      `/recordings/${match.params.id}`
    );
    setEditorValue(debugCode);
    setCookies(authedCookies);
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
