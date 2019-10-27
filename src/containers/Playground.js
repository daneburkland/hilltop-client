import React, { useState } from "react";
import AceEditor from "react-ace";
import config from "shared/config";

import "brace/mode/javascript";
import "brace/theme/monokai";

// const port = "3000";
// const hostname = "localhost";
// const port = null;
const dev = true;

const hilltopChromeUrl = dev
  ? "http://localhost:8888"
  : config.hilltopChromeUrl;
const devToolsUrl = `${hilltopChromeUrl}/devtools/inspector.html`;

const hilltopChromeDomain = dev ? "localhost:8888" : config.hilltopChromeDomain;
const wsLocation = `${hilltopChromeDomain}/debugger;`;

function Playground() {
  const debugUrlInitial = `${devToolsUrl}?${dev ? "ws" : "wss"}=${wsLocation}`;

  const [editorValue, setEditorValue] = useState("");
  const [refreshIframeCount, setRefreshIframeCount] = useState(0);

  const loadIframe = () => {
    const stringifiedCode = encodeURIComponent(`${editorValue}`);
    document.cookie = `hilltop_code=${stringifiedCode}`;
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
