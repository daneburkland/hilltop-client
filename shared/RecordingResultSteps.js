import React from "react";
import { ListGroup } from "react-bootstrap";
import Step from "shared/RecordingResultStep";

function RecordingResultSteps({ steps, latestResult }) {
  return (
    <div className="mb-4">
      <h3>Steps:</h3>
      <ListGroup>
        {!!steps &&
          steps.map((step, i) => (
            <Step
              key={i}
              step={step}
              stepResult={
                latestResult &&
                latestResult.stepResults &&
                latestResult.stepResults[step.id]
              }
            />
          ))}
      </ListGroup>
    </div>
  );
}

export default RecordingResultSteps;
