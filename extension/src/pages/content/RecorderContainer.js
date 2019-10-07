import { connect } from "react-redux";
import React from "react";
import Recorder from "./Recorder";
import { addEvent } from "../background/actions";
// import { parseEvent } from "../EventRecorder";
import EventRecorder from "../EventRecorder";

// Need to parse events in the content script b/c browser events can't be sent
// across chrome extension protocol(?)
function RecorderContainer({ handleAddEvent, isRecording, isAddingHoverStep }) {
  function handleClick(e) {
    handleAddEvent(EventRecorder.parseEvent(e));
    // window.setTimeout(() => handleAddEvent(EventRecorder.parseEvent(e)), 0);
  }

  function handleChange(e) {
    handleAddEvent(EventRecorder.parseEvent(e));
  }

  function handleKeypress(e) {
    // handleAddEvent(EventRecorder.parseEvent(e));
    // window.setTimeout(() => handleAddEvent(parseEvent(e)), 0);
  }

  function handleKeydown(e) {
    window.setTimeout(() => handleAddEvent(EventRecorder.parseEvent(e)), 0);
  }

  return (
    <Recorder
      onClick={handleClick}
      onChange={handleChange}
      onKeypress={handleKeypress}
      onKeydown={handleKeydown}
      condition={isRecording && !isAddingHoverStep}
    />
  );
}

const mapStateToProps = ({ dashboard }) => ({
  isRecording: dashboard.isRecording,
  isAddingHoverStep: dashboard.isAddingHoverStep
});

const mapDispatchToProps = dispatch => ({
  handleAddEvent: e => dispatch(addEvent(e))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecorderContainer);
