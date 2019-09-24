import React from "react";
import { connect } from "react-redux";
import { toggleRecord } from "../background/actions";
import {
  handleSaveRecordingAliased,
  handleClearRecording,
  handleConfirmAuth
} from "../background/actions";
import { ListGroup, Button, Alert } from "react-bootstrap";
import AuthenticationDetected from "./AuthenticationDetected";

function TypeTargetMeta({ step: { target, normalType } }) {
  return (
    <>
      <span>{`${normalType} on `}</span>
      <code>{`${target.localName} `}</code>"
      <span className="font-italic">{target.value}"</span>
    </>
  );
}

function ClickTargetMeta({ step: { target, normalType } }) {
  return (
    <>
      <span>{`${normalType} on `}</span>
      <code>{`${target.localName} `}</code>
      {target.firstChildNodeName === "#text" ? (
        <span>{`"${target.innerText}"`}</span>
      ) : (
        <span>{target.id ? `#${target.id}` : target.className}</span>
      )}
    </>
  );
}

function ChangeTargetMeta({ step: { target, normalType } }) {
  return (
    <>
      <span>{`${normalType} `}</span>
      <code>{`${target.localName} `}</code>
      <span>{target.id ? `#${target.id}` : target.className}</span>
    </>
  );
}

function TargetMeta({ step, step: { normalType } }) {
  switch (normalType) {
    case "type":
      return <TypeTargetMeta step={step} />;
    case "click":
      return <ClickTargetMeta step={step} />;
    case "change":
      return <ChangeTargetMeta step={step} />;
    default:
      return null;
  }
}

function Step({ step }) {
  return (
    <ListGroup.Item className="text-truncate">
      <TargetMeta step={step} />
    </ListGroup.Item>
  );
}

function RecordedSteps({
  steps,
  handleSave,
  isRecording,
  handleToggleRecord,
  handleClearRecording,
  handleConfirmAuth,
  hasCookies,
  saveSuccess,
  isSaving
}) {
  return (
    <div>
      <div className="d-flex justify-content-between pb-2">
        {saveSuccess ? (
          <Alert variant="success">Successfully Saved!</Alert>
        ) : (
          <>
            <Button
              variant={isRecording ? "danger" : "secondary"}
              onClick={handleToggleRecord}
            >
              {isRecording ? "Pause run" : "Resume run"}
            </Button>
            <Button variant="outline-danger" onClick={handleClearRecording}>
              Clear run
            </Button>
          </>
        )}
      </div>
      {hasCookies && <AuthenticationDetected onConfirm={handleConfirmAuth} />}
      <ListGroup>
        {!!steps && steps.map(step => <Step step={step} />)}
      </ListGroup>
      {!!steps.length && (
        <Button className="mt-4" onClick={handleSave}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      )}
    </div>
  );
}

const mapStateToProps = ({
  dashboard,
  dashboard: { steps, saveSuccess, isRecording, isSaving }
}) => ({
  steps,
  isSaving,
  saveSuccess,
  isRecording,
  hasCookies: !!dashboard.cookies.length
});

const mapDispatchToProps = dispatch => ({
  handleSave: () => dispatch(handleSaveRecordingAliased()),
  handleClearRecording: () => dispatch(handleClearRecording()),
  handleToggleRecord: () => dispatch(toggleRecord()),
  handleConfirmAuth: () => dispatch(handleConfirmAuth())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecordedSteps);
