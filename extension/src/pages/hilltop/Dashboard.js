import React, { useEffect } from "react";
import { connect } from "react-redux";
import { toggleRecord } from "../background/actions";
import RecordingDashboard from "./RecordingDashboard";
import RecordingList from "shared/RecordingList";
import { fetchUserSettingsAliased } from "../background/actions";

function Dashboard({ isRecording, steps = [], fetchUserSettings, history }) {
  useEffect(() => {
    fetchUserSettings();
  }, []);
  return (
    <div className="container">
      <div className="col-12 py-4">
        {isRecording || !!steps.length ? (
          <RecordingDashboard history={history} />
        ) : (
          <RecordingList />
        )}
      </div>
    </div>
  );
}

const mapStateToProps = ({ dashboard: { isRecording, recording = {} } }) => ({
  isRecording: isRecording,
  steps: recording && recording.steps
});

const mapDispatchToProps = dispatch => ({
  handleToggleRecord: () => dispatch(toggleRecord()),
  fetchUserSettings: () => dispatch(fetchUserSettingsAliased)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
