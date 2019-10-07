import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { ListGroup, Alert } from "react-bootstrap";
import Step from "shared/RecordedStep";
import LoaderButton from "shared/components/LoaderButton";
import Loader from "shared/Loader";
import { isEmpty } from "lodash";
import {
  handleFetchRecording,
  handleRunTest,
  handleScheduleTest,
  handlePauseTest
} from "../actions";

function Recording({
  match,
  handleFetchRecording,
  handleScheduleTest,
  handlePauseTest,
  handleRunTest,
  isFetchingRecording,
  isUpdatingRecording,
  recording,
  recording: { steps, location, results = [] }
}) {
  useEffect(() => {
    handleFetchRecording(match.params.id);
  }, []);

  const latestResult = !!results.length && results[results.length - 1];
  const latestResultIsOk = latestResult.statusText === "OK";

  return isFetchingRecording || isEmpty(recording) ? (
    <Loader />
  ) : (
    <div className="container py-4">
      <Alert variant="secondary">{`Starting URL: ${location}`}</Alert>
      <h2>Status:</h2>
      <Alert variant={latestResultIsOk ? "success" : "danger"}>
        {latestResult.statusText}
      </Alert>
      <ListGroup>
        {!!steps && steps.map((step, i) => <Step key={i} step={step} />)}
      </ListGroup>
      <Button
        className="mr-3 my-3"
        onClick={() => handleRunTest(recording.testCode)}
        variant="primary"
      >
        Run
      </Button>
      <LoaderButton
        className="mr-3 my-3"
        isLoading={isUpdatingRecording}
        text={recording.isActive ? "Pause test" : "Enable test"}
        loadingText="Loading..."
        onClick={
          recording.isActive
            ? handlePauseTest
            : () => handleScheduleTest(recording.testCode)
        }
        variant={recording.isActive ? "danger" : "primary"}
      />
    </div>
  );
}

const mapStateToProps = ({
  main: { recording, isFetchingRecording, isUpdatingRecording }
}) => ({
  recording,
  isFetchingRecording,
  isUpdatingRecording
});
const mapDispatchToProps = dispatch => ({
  handleFetchRecording: id => dispatch(handleFetchRecording(id)),
  handleRunTest: code => dispatch(handleRunTest(code)),
  handleScheduleTest: () => dispatch(handleScheduleTest()),
  handlePauseTest: () => dispatch(handlePauseTest())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Recording);
