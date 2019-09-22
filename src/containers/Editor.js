import React, { useState } from "react";
import AceEditor from "react-ace";

import "brace/mode/javascript";
import "brace/theme/monokai";

const hostname = "localhost";
const port = "8888";

const devToolsUrl = `http://${hostname}:${
  port ? `${port}` : ""
}/devtools/inspector.html`;

const initialCode = `
module.exports = async ({ page }) => {
  await page.goto('https://nytimes.com');
};
`;

function Editor() {
  const secure = false;
  const wsLocation = `${hostname}${port ? `:${port}` : ""}/debugger`;
  const debugUrlInitial = `${devToolsUrl}?${
    secure ? "wss" : "ws"
  }=${wsLocation}`;

  const [editorValue, setEditorValue] = useState(initialCode);
  const [refreshIframeCount, setRefreshIframeCount] = useState(0);

  const loadIframe = () => {
    const stringifiedCode = encodeURIComponent(editorValue);
    document.cookie = `browserless_code=${stringifiedCode}`;
    setRefreshIframeCount(refreshIframeCount + 1);
  };

  return (
    // TODO: figure out better style
    <div className="d-flex" style={{ height: `calc(100vh - 52px)` }}>
      <AceEditor
        height="inherit"
        mode="javascript"
        theme="monokai"
        onChange={value => setEditorValue(value)}
        defaultValue={initialCode}
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
