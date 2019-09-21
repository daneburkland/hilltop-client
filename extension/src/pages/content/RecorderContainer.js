import { connect } from "react-redux";
import React from "react";
import Recorder from "./Recorder";
import { addEvent } from "../background/actions";
import { parseEvent } from "../utils";

function RecorderContainer({ handleAddEvent, mode }) {
  function handleClick(e) {
    console.log("handling click event:", e);
    handleAddEvent(parseEvent(e));
  }

  function handleKeyPress(e) {
    console.log("handling keyboard event:", e);
    handleAddEvent(parseEvent(e));
  }
  return (
    <Recorder
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      condition={mode === "record"}
    />
  );
}

const mapStateToProps = ({ dashboard }) => ({
  events: dashboard.events,
  mode: dashboard.mode
});

const mapDispatchToProps = dispatch => ({
  handleAddEvent: e => dispatch(addEvent(e))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecorderContainer);
