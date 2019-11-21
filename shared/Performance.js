import React, { useEffect, useState } from "react";

function Performance({ latestResult }) {
  const [tracing, setTracing] = useState(null);

  async function handleFetchTracing() {
    try {
      const tracing = await latestResult.fetchTracing();

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
        View performance profile
      </a>
    </div>
  );
}

export default Performance;
