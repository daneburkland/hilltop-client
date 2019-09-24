import React from "react";
import { connect } from "react-redux";
import { toggleRecord } from "../background/actions";
import RecordedSteps from "./RecordedSteps";
import { Button, Jumbotron } from "react-bootstrap";

function Lander({ onRecord }) {
  return (
    <Jumbotron>
      <Button variant={"primary"} onClick={() => onRecord()}>
        Record
      </Button>
    </Jumbotron>
  );
}

function Dashboard({ handleToggleRecord, isRecording, steps }) {
  return (
    <div className="container">
      <div className="col-12 py-4">
        {isRecording || !!steps.length ? (
          <RecordedSteps />
        ) : (
          <Lander onRecord={handleToggleRecord} />
        )}
      </div>
    </div>
  );
}

const mapStateToProps = ({ dashboard }) => ({
  isRecording: dashboard.isRecording,
  steps: dashboard.steps
});

const mapDispatchToProps = dispatch => ({
  handleToggleRecord: () => dispatch(toggleRecord())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
