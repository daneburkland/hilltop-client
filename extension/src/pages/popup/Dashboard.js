import React, { useEffect } from "react";
import { connect } from "react-redux";
import { toggleRecord } from "../background/actions";
import RecordedSteps from "./RecordedSteps";
import { Button, Jumbotron } from "react-bootstrap";
import { fetchUserSettingsAliased } from "../background/actions";

function Lander({ onRecord }) {
  return (
    <Jumbotron>
      <Button variant={"primary"} onClick={() => onRecord()}>
        Record
      </Button>
    </Jumbotron>
  );
}

function Dashboard({
  handleToggleRecord,
  isRecording,
  steps,
  fetchUserSettings
}) {
  useEffect(() => {
    fetchUserSettings();
  }, []);
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
  handleToggleRecord: () => dispatch(toggleRecord()),
  fetchUserSettings: () => dispatch(fetchUserSettingsAliased)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
