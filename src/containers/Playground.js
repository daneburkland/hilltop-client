import React, { useState, useEffect } from "react";
import AceEditor from "react-ace";
import { API } from "aws-amplify";
import config from "shared/config";

import "brace/mode/javascript";
import "brace/theme/monokai";

// const port = "3000";
const hostname = "localhost";
const port = "8888";

// const devToolsUrl = `${config.hilltopChromeUrl}:${
//   port ? `${port}` : ""
// }/devtools/inspector.html`;

const devToolsUrl = `http://${hostname}:${
  port ? `${port}` : ""
}/devtools/inspector.html`;

function Playground() {
  const secure = false;
  // const wsLocation = `${config.hilltopChromeDomain}:${port}/debugger`;
  const wsLocation = `${hostname}${port ? `:${port}` : ""}/debugger`;
  const debugUrlInitial = `${devToolsUrl}?${
    secure ? "wss" : "ws"
  }=${wsLocation}`;

  const [editorValue, setEditorValue] = useState("");
  const [refreshIframeCount, setRefreshIframeCount] = useState(0);

  const loadIframe = () => {
    const stringifiedCode = encodeURIComponent(`${editorValue}`);
    document.cookie = `browserless_code=${stringifiedCode}`;
    setRefreshIframeCount(refreshIframeCount + 1);
  };

  // useEffect(() => {
  //   loadIframe();
  // }, [editorValue]);

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

export default Playground;
