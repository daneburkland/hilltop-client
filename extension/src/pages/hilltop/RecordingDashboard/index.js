import React, { useState, useEffect } from "react";
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
import AuthFlowStatus from "./AuthFlowStatus";

import "brace/mode/javascript";
import "brace/theme/monokai";

function RecordingDashboard({
  isSaving,
  showCode,
  isAddingHoverStep,
  handleCancelAddHoverStep,
  handleDeleteStep,
  updateRecordingName,
  saveRecording,
  history,
  recording,
  recording: { name: recordingName, steps, authFlow, code }
}) {
  const [name, setName] = useState(recordingName);
  function handleUpdateName() {
    updateRecordingName(name);
  }

  async function handleSaveRecording({ isAuthFlow }) {
    await saveRecording({ isAuthFlow });
  }

  useEffect(() => {
    if (!!recording.recordingId) {
      history.push(`/recording/${recording.recordingId}`);
    }
  }, [recording.recordingId]);

  useEffect(() => {
    setName(recordingName);
  }, [recordingName]);

  if (isAddingHoverStep) {
    return <AddingHoverStep onCancel={handleCancelAddHoverStep} />;
  } else
    return (
      <div>
        <HeaderControls />
        <AuthFlowStatus authFlow={authFlow} />
        <form>
          <div className="form-group d-flex align-items-center">
            <label htmlFor="exampleInputEmail1" className="mr-3">
              Name
            </label>
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
            height="450px"
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
            <Button className="mr-3" onClick={handleSaveRecording}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => handleSaveRecording({ isAuthFlow: true })}
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
    recording = {},
    saveSuccess,
    isSaving,
    showCode,
    isAddingHoverStep,
    saveFailure,
    response
  }
}) => ({
  recording,
  isSaving,
  saveSuccess,
  showCode,
  isAddingHoverStep,
  saveFailure,
  response
});

const mapDispatchToProps = dispatch => ({
  saveRecording: ({ isAuthFlow = false }) =>
    dispatch(handleSaveRecordingAliased({ isAuthFlow })),
  handleCreateNew: () => dispatch(handleCreateNew()),
  handleCancelAddHoverStep: () => dispatch(handleCancelAddHoverStep()),
  handleDeleteStep: stepId => dispatch(deleteStep(stepId)),
  updateRecordingName: name => dispatch(updateRecordingName(name))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecordingDashboard);
