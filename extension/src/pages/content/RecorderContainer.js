import { connect } from "react-redux";
import React from "react";
import Recorder from "./Recorder";
import { addEvent } from "../background/actions";
import { parseEvent } from "../utils";

function RecorderContainer({ handleAddEvent, isRecording }) {
  function handleClick(e) {
    window.setTimeout(() => handleAddEvent(parseEvent(e)), 0);
  }

  function handleChange(e) {
    handleAddEvent(parseEvent(e));
  }

  function handleKeypress(e) {
    window.setTimeout(() => handleAddEvent(parseEvent(e)));
  }

  return (
    <Recorder
      onClick={handleClick}
      onChange={handleChange}
      onKeypress={handleKeypress}
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
