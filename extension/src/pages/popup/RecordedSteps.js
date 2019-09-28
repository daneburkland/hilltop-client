import React from "react";
import AceEditor from "react-ace";
import { connect } from "react-redux";
import {
  toggleRecord,
  handleSaveRecordingAliased,
  handleClearRecording,
  handleConfirmAuth,
  toggleShowCode,
  handleCreateNew
} from "../background/actions";
import { ListGroup, Button, Alert } from "react-bootstrap";
import AuthenticationDetected from "./AuthenticationDetected";

import "brace/mode/javascript";
import "brace/theme/monokai";

function IdOrClassSelector({ normalizedAttrs }) {
  const idAttr = normalizedAttrs.find(attr => attr.nodeName === "id");
  const classAttr = normalizedAttrs.find(attr => attr.nodeName === "class");
  return <span>{!!idAttr ? `#${idAttr.nodeValue}` : classAttr.nodeValue}</span>;
}

function InputTargetMeta({ step: { target, normalType } }) {
  return (
    <>
      <span>{`${normalType} on `}</span>
      <code>{`${target.localName} `}</code>"
      <span className="font-italic">{target.value}"</span>
    </>
  );
}

function KeypressTargetMeta() {
  return (
    <>
      <span>Pressed enter</span>
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
        <IdOrClassSelector normalizedAttrs={target.normalizedAttrs} />
      )}
    </>
  );
}

function ChangeTargetMeta({ step: { target, normalType } }) {
  return (
    <>
      <span>{`${normalType} `}</span>
      <code>{`${target.localName} `}</code>
      <IdOrClassSelector normalizedAttrs={target.normalizedAttrs} />
    </>
  );
}

function TargetMeta({ step, step: { normalType } }) {
  switch (normalType) {
    case "type":
      return <InputTargetMeta step={step} />;
    case "click":
      return <ClickTargetMeta step={step} />;
    case "change":
      return <ChangeTargetMeta step={step} />;
    case "keypress":
      return <KeypressTargetMeta />;
    default:
      return null;
  }
}

// TODO: move this into /shared
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
  isSaving,
  location,
  puppeteerCode,
  showCode,
  handleToggleCode,
  handleCreateNew
}) {
  return saveSuccess ? (
    <>
      <Alert variant="success">Successfully Saved!</Alert>
      <Button onClick={handleCreateNew} variant="primary">
        Create new recording
      </Button>
    </>
  ) : (
    <div>
      <div className="d-flex justify-content-between pb-2">
        <>
          <Button
            variant={isRecording ? "danger" : "secondary"}
            onClick={handleToggleRecord}
          >
            {isRecording ? "Pause run" : "Resume run"}
          </Button>
          <div>
            <Button variant="outline-secondary mr-2" onClick={handleToggleCode}>
              {showCode ? "Show steps" : "Show code"}
            </Button>
            <Button variant="outline-danger" onClick={handleClearRecording}>
              Clear run
            </Button>
          </div>
        </>
      </div>
      {hasCookies && <AuthenticationDetected onConfirm={handleConfirmAuth} />}
      {!!location && (
        <Alert variant="secondary">{`Starting URL: ${location.href}`}</Alert>
      )}
      {showCode ? (
        <AceEditor
          height="200px"
          showGutter={false}
          width="auto"
          mode="javascript"
          theme="monokai"
          value={puppeteerCode}
        />
      ) : (
        <ListGroup>
          {!!steps && steps.map(step => <Step step={step} />)}
        </ListGroup>
      )}
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
  dashboard: {
    steps,
    saveSuccess,
    isRecording,
    isSaving,
    location,
    showCode,
    puppeteerCode
  }
}) => ({
  steps,
  isSaving,
  saveSuccess,
  isRecording,
  location,
  showCode,
  puppeteerCode,
  hasCookies: !!dashboard.cookies.length
});

const mapDispatchToProps = dispatch => ({
  handleSave: () => dispatch(handleSaveRecordingAliased()),
  handleClearRecording: () => dispatch(handleClearRecording()),
  handleToggleRecord: () => dispatch(toggleRecord()),
  handleConfirmAuth: () => dispatch(handleConfirmAuth()),
  handleToggleCode: () => dispatch(toggleShowCode()),
  handleCreateNew: () => dispatch(handleCreateNew())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecordedSteps);
