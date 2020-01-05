import React, { useEffect } from "react";
import { connect } from "react-redux";
import { toggleRecord } from "../background/actions";
import RecordingDashboard from "./RecordingDashboard";
import Recording from "shared/classes/Recording";
import RecordingList from "shared/RecordingList";
import { fetchUserSettingsAliased } from "../background/actions";

function Dashboard({ recording, isRecording, fetchUserSettings, history }) {
  useEffect(() => {
    fetchUserSettings();
  }, []);

  return (
    <div className="container">
      <div className="col-12 py-4">
        {isRecording || !recording.isEmpty() ? (
          <RecordingDashboard history={history} />
        ) : (
          <RecordingList />
        )}
      </div>
    </div>
  );
}

const mapStateToProps = ({ dashboard: { isRecording, recording } }) => ({
  isRecording: isRecording,
  recording: Recording.from(recording)
});

const mapDispatchToProps = dispatch => ({
  handleToggleRecord: () => dispatch(toggleRecord()),
  fetchUserSettings: () => dispatch(fetchUserSettingsAliased)
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
