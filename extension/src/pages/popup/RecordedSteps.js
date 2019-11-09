import React from "react";
import AceEditor from "react-ace";
import { connect } from "react-redux";
import {
  toggleRecord,
  handleSaveRecordingAliased,
  handleClearRecording,
  toggleShowCode,
  handleCreateNew,
  handleCancelAddHoverStep,
  deleteStep
} from "../background/actions";
import { ListGroup, Button, Alert, Card } from "react-bootstrap";
import ManualSteps from "./ManualSteps";
import AddingHoverStep from "./AddingHoverStep";
import Step from "shared/RecordedStep";

import "brace/mode/javascript";
import "brace/theme/monokai";

function SaveSuccess({ onCreateNew }) {
  return (
    <>
      <Alert variant="success">Successfully Saved!</Alert>
      <Button onClick={onCreateNew} variant="primary">
        Create new recording
      </Button>
    </>
  );
}

function SaveFailure({ response, onCreateNew }) {
  return (
    <>
      <Alert variant="danger">Failed to run and save recording:</Alert>
      <Card className="py-1 px-1">{response.message}</Card>
      <Button onClick={onCreateNew} variant="primary">
        Try again
      </Button>
    </>
  );
}

function RecordedSteps({
  steps,
  handleSave,
  isRecording,
  handleToggleRecord,
  handleClearRecording,
  saveSuccess,
  isSaving,
  location,
  code,
  showCode,
  handleToggleCode,
  handleCreateNew,
  isAddingHoverStep,
  handleCancelAddHoverStep,
  saveFailure,
  response,
  handleDeleteStep
}) {
  if (saveSuccess) {
    return <SaveSuccess onCreateNew={handleCreateNew} />;
  } else if (saveFailure) {
    return <SaveFailure response={response} onCreateNew={handleCreateNew} />;
  } else if (isAddingHoverStep) {
    return <AddingHoverStep onCancel={handleCancelAddHoverStep} />;
  } else
    return (
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
              <Button
                variant="outline-secondary mr-2"
                onClick={handleToggleCode}
              >
                {showCode ? "Show steps" : "Show code"}
              </Button>
              <Button variant="outline-danger" onClick={handleClearRecording}>
                Clear run
              </Button>
            </div>
          </>
        </div>
        <ManualSteps />
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
            value={code}
          />
        ) : (
          <ListGroup>
            {!!steps &&
              steps.map((step, i) => (
                <Step step={step} key={i} onDeleteStep={handleDeleteStep} />
              ))}
          </ListGroup>
        )}
        {!!steps.length && (
          <div className="mt-4">
            <Button className="mr-3" onClick={handleSave}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => handleSave({ isAuthFlow: true })}
            >
              {isSaving ? "Saving login..." : "Save as authentication flow"}
            </Button>
          </div>
        )}
      </div>
    );
}

const mapStateToProps = ({
  dashboard: {
    recording: { steps, location, code },
    saveSuccess,
    isRecording,
    isSaving,
    showCode,
    isAddingHoverStep,
    saveFailure,
    response
  }
}) => ({
  steps,
  isSaving,
  saveSuccess,
  isRecording,
  location,
  showCode,
  code,
  isAddingHoverStep,
  saveFailure,
  response
});

const mapDispatchToProps = dispatch => ({
  handleSave: ({ isAuthFlow = false }) =>
    dispatch(handleSaveRecordingAliased({ isAuthFlow })),
  handleClearRecording: () => dispatch(handleClearRecording()),
  handleToggleRecord: () => dispatch(toggleRecord()),
  handleToggleCode: () => dispatch(toggleShowCode()),
  handleCreateNew: () => dispatch(handleCreateNew()),
  handleCancelAddHoverStep: () => dispatch(handleCancelAddHoverStep()),
  handleDeleteStep: stepId => dispatch(deleteStep(stepId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecordedSteps);
