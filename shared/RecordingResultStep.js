import { Storage } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { ListGroup, Alert } from "react-bootstrap";
import { TargetMeta } from "./RecordedStep";

function Screenshot({ className, screenshot: { key } = {} } = {}) {
  const [screenshotSrc, setScreenshotSrc] = useState(null);
  useEffect(() => {
    async function fetchScreenshot() {
      try {
        const result = await Storage.get(key);

        setScreenshotSrc(result);
      } catch (e) {
        console.log(e);
      }
    }
    fetchScreenshot();
  }, []);
  return (
    <img
      className={`pl-3 ${className}`}
      style={{ width: 200, height: "auto" }}
      alt=""
      src={screenshotSrc}
    />
  );
}

function Failure({ error = "Failed here" }) {
  return (
    <Alert style={{ width: 500 }} variant="danger">
      {error}
    </Alert>
  );
}

export default function Step({ step, stepResult = {} }) {
  return (
    <ListGroup.Item className="d-flex justify-content-between align-items-center">
      <TargetMeta step={step} />
      {stepResult.error && <Failure error={stepResult.error} />}
      {stepResult && (
        <>
          {stepResult.elementScreenshot && (
            <Screenshot screenshot={stepResult.elementScreenshot} />
          )}
          <Screenshot
            screenshot={stepResult.pageScreenshot}
            className="ml-auto"
          />
        </>
      )}
    </ListGroup.Item>
  );
}
