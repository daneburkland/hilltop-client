import React, { useState } from "react";
import AceEditor from "react-ace";
import { connect } from "react-redux";
import {
  handleSaveRecordingAliased,
  handleCreateNew,
  handleCancelAddHoverStep,
  deleteStep,
  updateRecordingName
} from "../../background/actions";
import { ListGroup, Button, Alert, Card } from "react-bootstrap";
import ManualSteps from "../ManualSteps";
import AddingHoverStep from "../AddingHoverStep";
import Step from "shared/RecordedStep";
import HeaderControls from "./HeaderControls";

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

function RecordingDashboard({
  steps,
  handleSave,
  saveSuccess,
  isSaving,
  location,
  code,
  showCode,
  handleCreateNew,
  isAddingHoverStep,
  handleCancelAddHoverStep,
  saveFailure,
  response,
  handleDeleteStep,
  updateRecordingName,
  recordingName
}) {
  const [name, setName] = useState(recordingName);
  function handleUpdateName() {
    debugger;
    updateRecordingName(name);
  }
  if (saveSuccess) {
    return <SaveSuccess onCreateNew={handleCreateNew} />;
  } else if (saveFailure) {
    return <SaveFailure response={response} onCreateNew={handleCreateNew} />;
  } else if (isAddingHoverStep) {
    return <AddingHoverStep onCancel={handleCancelAddHoverStep} />;
  } else
    return (
      <div>
        <HeaderControls />
        <form>
          <div className="form-group">
            <label for="exampleInputEmail1">Recording name</label>
            <input
              type="text"
              className="form-control"
              aria-describedby="emailHelp"
              value={name}
              onChange={({ target: { value } }) => setName(value)}
              onBlur={handleUpdateName}
            />
          </div>
        </form>
        <ManualSteps />
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
    recording: { steps, location, code, name },
    saveSuccess,
    isSaving,
    showCode,
    isAddingHoverStep,
    saveFailure,
    response
  }
}) => ({
  steps,
  recordingName: name,
  isSaving,
  saveSuccess,
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
  handleCreateNew: () => dispatch(handleCreateNew()),
  handleCancelAddHoverStep: () => dispatch(handleCancelAddHoverStep()),
  handleDeleteStep: stepId => dispatch(deleteStep(stepId)),
  updateRecordingName: name => dispatch(updateRecordingName(name))
});

export default connect(mapStateToProps, mapDispatchToProps)(RecordingDashboard);
