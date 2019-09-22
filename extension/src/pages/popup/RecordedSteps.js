import React from "react";
import { connect } from "react-redux";
import { toggleRecord } from "../background/actions";
import {
  handleSaveRecordingAliased,
  handleClearRecording
} from "../background/actions";
import { ListGroup, Button } from "react-bootstrap";

function Step({ step: { normalType, target } }) {
  return (
    <ListGroup.Item>
      <span>{`${normalType} on `}</span>
      <span>{target.id ? target.id : target.className}</span>
      {normalType === "type" ? (
        <span>{target.value}</span>
      ) : (
        <span>{target.innerText}</span>
      )}
    </ListGroup.Item>
  );
}

function RecordedSteps({
  steps,
  handleSave,
  isRecording,
  handleToggleRecord,
  handleClearRecording
}) {
  return (
    <div>
      <div className="d-flex justify-content-between py-2">
        <Button
          variant={isRecording ? "danger" : "secondary"}
          onClick={handleToggleRecord}
        >
          {isRecording ? "Pause run" : "Resume run"}
        </Button>
        <Button variant="outline-danger" onClick={handleClearRecording}>
          Clear run
        </Button>
      </div>
      <ListGroup>
        {!!steps && steps.map(step => <Step step={step} />)}
      </ListGroup>
      {!!steps.length && (
        <Button className="mt-4" onClick={handleSave}>
          Save
        </Button>
      )}
    </div>
  );
}

const mapStateToProps = ({ dashboard }) => ({
  steps: dashboard.steps,
  isRecording: dashboard.isRecording
});

const mapDispatchToProps = dispatch => ({
  handleSave: () => dispatch(handleSaveRecordingAliased()),
  handleClearRecording: () => dispatch(handleClearRecording()),
  handleToggleRecord: () => dispatch(toggleRecord())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecordedSteps);
