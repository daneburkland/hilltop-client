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

const wrapCode = code =>
  `
  module.exports = async ({ page }) => {
    ${code}
  };
  `;

function Editor({ match }) {
  const secure = false;
  const wsLocation = `${hostname}${port ? `:${port}` : ""}/debugger`;
  const debugUrlInitial = `${devToolsUrl}?${
    secure ? "wss" : "ws"
  }=${wsLocation}`;

  const [editorValue, setEditorValue] = useState("");
  const [fetchedCode, setFetchedCode] = useState(null);
  const [refreshIframeCount, setRefreshIframeCount] = useState(0);

  const fetchAndSetData = async () => {
    const response = await API.get("notes", `/notes/${match.params.id}`);
    setEditorValue(wrapCode(response.puppeteerCode));
    setFetchedCode(true);
  };

  const loadIframe = () => {
    const stringifiedCode = encodeURIComponent(`${editorValue}`);
    document.cookie = `browserless_code=${stringifiedCode}`;
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
