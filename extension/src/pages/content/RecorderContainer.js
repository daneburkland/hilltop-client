import { connect } from "react-redux";
import React from "react";
import Recorder from "./Recorder";
import { addEvent } from "../background/actions";
import { parseEvent } from "../utils";

// Need to parse events in the content script b/c browser events can't be sent
// across chrome extension protocol(?)
function RecorderContainer({ handleAddEvent, isRecording }) {
  function handleClick(e) {
    window.setTimeout(() => handleAddEvent(parseEvent(e)), 0);
  }

  function handleChange(e) {
    handleAddEvent(parseEvent(e));
  }

  function handleKeypress(e) {
    handleAddEvent(parseEvent(e));
    // window.setTimeout(() => handleAddEvent(parseEvent(e)), 0);
  }

  function handleKeydown(e) {
    console.log("key upping");
  }

  return (
    <Recorder
      onClick={handleClick}
      onChange={handleChange}
      onKeypress={handleKeypress}
      onKeydown={handleKeydown}
      condition={isRecording}
    />
  );
}

const mapStateToProps = ({ dashboard }) => ({
  isRecording: dashboard.isRecording
});

const mapDispatchToProps = dispatch => ({
  handleAddEvent: e => dispatch(addEvent(e))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecorderContainer);
