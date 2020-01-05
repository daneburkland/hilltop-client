import React, { useEffect, useState } from "react";
import { Alert, Spinner, Button } from "react-bootstrap";
import RecordingModel from "./classes/Recording";
import RecordingResultSteps from "shared/RecordingResultSteps";
import HealthCard from "./HealthCard";
import ResultTable from "./ResultTable";
import ResultChart from "./ResultChart";
import Loader from "shared/Loader";
import StatusCard from "./StatusCard";
import { isEmpty } from "lodash";
import { API } from "aws-amplify";

function Recording({ match }) {
  const [recording, setRecording] = useState(new RecordingModel());
  const [isUpdatingRecording, setIsUpdatingRecording] = useState(null);
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

  async function handleScheduleTest() {
    const { recordingId, code } = recording;
    setIsUpdatingRecording(true);
    const response = await API.post("recordingTests", "/add", {
      body: {
        recordingId,
        code
      }
    });
    setRecording(RecordingModel.from(response));
    setIsUpdatingRecording(false);
  }

  async function handlePauseTest() {
    const { recordingId } = recording;
    setIsUpdatingRecording(true);
    const response = await API.post("recordingTests", "/pause", {
      body: {
        recordingId
      }
    });
    setRecording(RecordingModel.from(response));
    setIsUpdatingRecording(false);
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
      <Alert
        className="mb-4"
        variant="secondary"
      >{`Starting URL: ${location.href}`}</Alert>
      <div className="row mb-4">
        {!isEmpty(latestResult) ? (
          <>
            <HealthCard
              latestResult={latestResult}
              recordingId={match.params.id}
            />
            <StatusCard
              isActive={isActive}
              nextScheduledTest={nextScheduledTest}
              handleScheduleTest={handleScheduleTest}
              handlePauseTest={handlePauseTest}
            />
          </>
        ) : (
          <Alert
            className="d-flex align-items-center flex-grow-1"
            variant="info"
          >
            Running initial flow
            <Spinner className="ml-3" animation="grow" variant="light" />
          </Alert>
        )}
      </div>

      <RecordingResultSteps steps={steps} latestResult={latestResult} />

      {recording.hasResults() && (
        <>
          <ResultTable results={recording.results} />
          <ResultChart results={recording.results} />
        </>
      )}
      <Button
        className="mr-3 my-3"
        onClick={handleExecute}
        variant="primary"
        disabled={executing}
      >
        {executing ? "Running..." : "Run now"}
      </Button>
    </div>
  );
}

export default Recording;
