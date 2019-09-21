import React from "react";
import { connect } from "react-redux";
import { toggleRecord } from "../background/actions";
import RecordedSteps from "./RecordedSteps";

import "./dashboard.css";

class Dashboard extends React.Component {
  render() {
    const { handleToggleRecord, isRecording } = this.props;
    console.log(isRecording);
    return (
      <div>
        <button onClick={() => handleToggleRecord()}>
          {isRecording ? "Stop" : "Record"}
        </button>
        <RecordedSteps />
      </div>
    );
  }
}

const mapStateToProps = ({ dashboard }) => ({
  isRecording: dashboard.isRecording
});

const mapDispatchToProps = dispatch => ({
  handleToggleRecord: () => dispatch(toggleRecord())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
