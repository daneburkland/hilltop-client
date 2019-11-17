import React from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import {
  toggleRecord,
  handleClearRecording,
  toggleShowCode
} from "../../background/actions";

function HeaderControls({
  isRecording,
  showCode,
  handleToggleRecord,
  handleToggleCode,
  handleClearRecording
}) {
  return (
    <div className="d-flex justify-content-between pb-4">
      <>
        <Button
          variant={isRecording ? "danger" : "secondary"}
          onClick={handleToggleRecord}
        >
          {isRecording ? "Pause run" : "Resume run"}
        </Button>
        <div>
          <Button variant="outline-secondary mr-2" onClick={handleToggleCode}>
            {showCode ? "Show steps" : "Show code"}
          </Button>
          <Button variant="outline-danger" onClick={handleClearRecording}>
            Clear run
          </Button>
        </div>
      </>
    </div>
  );
}

const mapStateToProps = ({ dashboard: { isRecording, showCode } }) => ({
  isRecording,
  showCode
});

const mapDispatchToProps = dispatch => ({
  handleClearRecording: () => dispatch(handleClearRecording()),
  handleToggleRecord: () => dispatch(toggleRecord()),
  handleToggleCode: () => dispatch(toggleShowCode())
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderControls);
