import React from "react";
import "./settings.css";
import "./App";
import { connect } from "react-redux";
import {
  toggleCaptureSessionData,
  updateUserSettingsAliased
} from "../background/actions";
import { Button } from "react-bootstrap";

function Settings({
  handleUpdateSettings,
  handleToggleCaptureSessionData,
  userSettings: { captureSessionData }
}) {
  return (
    <div className="container">
      <h2 className="mb-3">Settings</h2>
      <div className="form-check mb-2">
        <input
          type="checkbox"
          className="form-check-input"
          onChange={handleToggleCaptureSessionData}
          checked={captureSessionData}
        />
        <label className="form-check-label">Capture session data</label>
      </div>
      <Button variant="primary" onClick={handleUpdateSettings}>
        Save
      </Button>
    </div>
  );
}

const mapStateToProps = ({ dashboard }) => ({
  userSettings: dashboard.userSettings
});

const mapDispatchToProps = dispatch => ({
  handleToggleCaptureSessionData: () => dispatch(toggleCaptureSessionData),
  handleUpdateSettings: () => dispatch(updateUserSettingsAliased)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
