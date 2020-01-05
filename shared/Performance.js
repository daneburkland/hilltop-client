import React, { useEffect, useState } from "react";
import Octicon, { LinkExternal } from "@primer/octicons-react";

function Performance({ result }) {
  const [tracing, setTracing] = useState(null);

  async function handleFetchTracing() {
    try {
      const tracing = await result.fetchTracing();

      setTracing(tracing);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    handleFetchTracing();
  }, []);

  return (
    <div>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`https://chromedevtools.github.io/timeline-viewer/?loadTimelineFromURL=${tracing}`}
      >
        <Octicon icon={LinkExternal} />
      </a>
    </div>
  );
}

export default Performance;
