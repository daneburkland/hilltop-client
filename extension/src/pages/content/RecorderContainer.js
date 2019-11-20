import { connect } from "react-redux";
import React from "react";
import Recorder from "./Recorder";
import { addEvent } from "../background/actions";
import Event from "../../classes/Event";

// Need to parse events in the content script b/c browser events can't be sent
// across chrome extension protocol(?)
function RecorderContainer({ handleAddEvent, isRecording, isAddingHoverStep }) {
  function handleClick(e) {
    handleAddEvent(new Event(e));
    // window.setTimeout(() => handleAddEvent(new Event(e)), 0);
  }

  function handleChange(e) {
    handleAddEvent(new Event(e));
  }

  function handleKeypress(e) {
    // handleAddEvent(new Event(e));
    // window.setTimeout(() => handleAddEvent(parseEvent(e)), 0);
  }

  function handleKeydown(e) {
    window.setTimeout(() => handleAddEvent(new Event(e)), 0);
  }

  function handlePopState(e) {}

  return (
    <Recorder
      onClick={handleClick}
      onChange={handleChange}
      onKeypress={handleKeypress}
      onKeydown={handleKeydown}
      onPopState={handlePopState}
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

export default connect(mapStateToProps, mapDispatchToProps)(RecorderContainer);
