import { connect } from "react-redux";
import React from "react";
import Recorder from "./Recorder";
import { addEvent } from "../background/actions";
import { parseEvent } from "../utils";

function RecorderContainer({ handleAddEvent, isRecording, steps, events }) {
  function handleClick(e) {
    handleAddEvent(parseEvent(e));
  }

  function handleKeyUp(e) {
    handleAddEvent(parseEvent(e));
  }
  console.log("steps", steps);
  console.log("events", events);
  return (
    <Recorder
      onClick={handleClick}
      onKeyUp={handleKeyUp}
      condition={isRecording}
    />
  );
}

const mapStateToProps = ({ dashboard }) => ({
  events: dashboard.events,
  isRecording: dashboard.isRecording,
  steps: dashboard.steps
});

const mapDispatchToProps = dispatch => ({
  handleAddEvent: e => dispatch(addEvent(e))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecorderContainer);
