import React, { useEffect } from "react";
import format from "date-fns/format";
import fromUnixTime from "date-fns/fromUnixTime";
import { connect } from "react-redux";
import { ListGroup, Alert, Spinner, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Step from "shared/RecordingResultStep";
import LoaderButton from "shared/components/LoaderButton";
import Loader from "shared/Loader";
import { isEmpty } from "lodash";
import {
  handleFetchRecording,
  handleRunTest,
  handleScheduleTest,
  handlePauseTest
} from "../actions";

function HealthBar({ latestResult, noteId }) {
  const latestResultIsOk = latestResult && !latestResult.error;
  return (
    <div className="d-flex">
      {isEmpty(latestResult) ? (
        <Alert className="d-flex align-items-center" variant="info">
          Running initial flow
          <Spinner className="ml-3" animation="grow" variant="light" />
        </Alert>
      ) : (
        <>
          <Alert
            className="flex-grow-1"
            variant={latestResultIsOk ? "success" : "danger"}
          >
            {latestResult.error ? "Failing" : "Ok"}
          </Alert>
          <LinkContainer to={`/editor/${noteId}`}>
            <Button
              className="ml-3 mb-3"
              variant={latestResultIsOk ? "outline-success" : "outline-danger"}
            >
              Debug
            </Button>
          </LinkContainer>
        </>
      )}
    </div>
  );
}

function Recording({
  match,
  handleFetchRecording,
  handleScheduleTest,
  handlePauseTest,
  handleRunTest,
  isFetchingRecording,
  isUpdatingRecording,
  recording,
  recording: {
    steps,
    location,
    code,
    isActive,
    nextScheduledTest,
    latestResult = {}
  }
}) {
  useEffect(() => {
    handleFetchRecording(match.params.id);
  }, []);

  return isFetchingRecording || isEmpty(recording) ? (
    <Loader />
  ) : (
    <div className="container py-4">
      <Alert variant="secondary">{`Starting URL: ${location.href}`}</Alert>
      <h2>Health:</h2>
      <HealthBar latestResult={latestResult} noteId={match.params.id} />
      {/* TODO: render a 'as of: XXX date' here */}

      <h2>Status:</h2>
      <Alert variant={isActive ? "primary" : "warning"}>
        {isActive ? "Active" : "Paused"}
      </Alert>
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
                latestResult.stepResults && latestResult.stepResults[step.id]
              }
            />
          ))}
      </ListGroup>
      <Button
        className="mr-3 my-3"
        onClick={() => handleRunTest(code)}
        variant="primary"
      >
        Run now
      </Button>
      <LoaderButton
        className="mr-3 my-3"
        isLoading={isUpdatingRecording}
        text={isActive ? "Pause test" : "Enable test"}
        loadingText="Loading..."
        onClick={isActive ? handlePauseTest : () => handleScheduleTest(code)}
        variant={isActive ? "danger" : "primary"}
      />
    </div>
  );
}

const mapStateToProps = ({
  main: { recording, isFetchingRecording, isUpdatingRecording, latestResult }
}) => ({
  recording,
  isFetchingRecording,
  isUpdatingRecording,
  latestResult
});
const mapDispatchToProps = dispatch => ({
  handleFetchRecording: id => dispatch(handleFetchRecording(id)),
  handleRunTest: code => dispatch(handleRunTest(code)),
  handleScheduleTest: () => dispatch(handleScheduleTest()),
  handlePauseTest: () => dispatch(handlePauseTest())
});

export default connect(mapStateToProps, mapDispatchToProps)(Recording);
