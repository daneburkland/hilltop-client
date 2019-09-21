import React, { useState } from "react";
import Iframe from "react-iframe";

function Recorder() {
  const [src, setSrc] = useState("https://google.com");
  return (
    <div className="flex" style={{ height: `calc(100vh - 52px)` }}>
      <Iframe sandbox="allow-same-origin" src={src} className="flex-grow" />
    </div>
  );
}

export default Recorder;
