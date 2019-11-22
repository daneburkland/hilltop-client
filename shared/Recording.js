import React, { useEffect, useState } from "react";
import format from "date-fns/format";
import fromUnixTime from "date-fns/fromUnixTime";
import { ListGroup, Alert, Button } from "react-bootstrap";
import Step from "shared/RecordingResultStep";
import LoaderButton from "shared/components/LoaderButton";
import RecordingModel from "./classes/Recording";
import Performance from "./Performance";
import HealthBar from "./HealthBar";
import ResultTable from "./ResultTable";
import Loader from "shared/Loader";

function Recording({ match }) {
  const [recording, setRecording] = useState(new RecordingModel());
  const [loadingInitial, setLoadingInitial] = useState(null);
  const [executing, setExecuting] = useState(null);

  const {
    steps,
    location,
    isActive,
    nextScheduledTest,
    latestResult
  } = recording;

  async function fetch(fetchPoll) {
    setLoadingInitial(true);
    const recording = await RecordingModel.fetch({ id: match.params.id });
    setRecording(recording);
    setLoadingInitial(false);
    if (recording.hasResults()) {
      clearInterval(fetchPoll);
    }
  }

  useEffect(() => {
    const fetchPoll = setInterval(async () => {
      const recording = await RecordingModel.fetch({ id: match.params.id });
      setRecording(recording);
      if (recording.hasResults()) {
        clearInterval(fetchPoll);
      }
    }, 3000);

    fetch(fetchPoll);

    return () => clearInterval(fetchPoll);
  }, []);

  async function handleExecute() {
    setExecuting(true);
    const updatedRecording = await recording.execute();
    setRecording(updatedRecording);
    setExecuting(false);
  }

  return loadingInitial ? (
    <Loader />
  ) : (
    <div className="container py-4">
      <Alert variant="secondary">{`Starting URL: ${location.href}`}</Alert>
      <h2>Health:</h2>
      <HealthBar latestResult={latestResult} recordingId={match.params.id} />
      {recording.hasResults() && (
        <>
          <Performance latestResult={latestResult} />
          <h2>Status:</h2>
          <Alert variant={isActive ? "primary" : "warning"}>
            {isActive ? "Active" : "Paused"}
          </Alert>
        </>
      )}
      {nextScheduledTest && (
        <div className="d-flex">
          <h5 className="mr-1">Next scheduled test:</h5>
          <p>
            <span className="mr-1">approximately</span>
            {format(fromUnixTime(nextScheduledTest), "EEEE MMM do h:mma z")}
          </p>
        </div>
      )}

      <ListGroup className="mb-3">
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

      {recording.hasResults() && <ResultTable results={recording.results} />}
      <Button
        className="mr-3 my-3"
        onClick={handleExecute}
        variant="primary"
        disabled={executing}
      >
        {executing ? "Running..." : "Run now"}
      </Button>
      <LoaderButton
        className="mr-3 my-3"
        // isLoading={isUpdatingRecording}
        text={isActive ? "Pause test" : "Enable test"}
        loadingText="Loading..."
        // onClick={isActive ? handlePauseTest : () => handleScheduleTest(code)}
        variant={isActive ? "danger" : "primary"}
      />
    </div>
  );
}

export default Recording;
