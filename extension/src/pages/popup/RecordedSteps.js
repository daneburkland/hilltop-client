import React from "react";
import { connect } from "react-redux";
import { handleSaveRecording } from "../background/actions";

function Step({ step: { normalType, target } }) {
  return (
    <div>
      <span>{`${normalType} on`}</span>
      <span>{target.id ? target.id : target.className}</span>
      {normalType === "type" ? (
        <span>{target.value}</span>
      ) : (
        <span>{target.innerText}</span>
      )}
    </div>
  );
}

function RecordedSteps({ steps, handleSave }) {
  console.log(steps);
  return (
    <div>
      {!!steps && steps.map(step => <Step step={step} />)}
      {!!steps.length && <button onClick={handleSave}>Save</button>}
    </div>
  );
}

const mapStateToProps = ({ dashboard }) => ({
  steps: dashboard.steps
});

const mapDispatchToProps = dispatch => ({
  handleSave: () => dispatch(handleSaveRecording())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecordedSteps);
