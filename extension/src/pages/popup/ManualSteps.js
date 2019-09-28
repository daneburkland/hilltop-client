import React from "react";
import { Button } from "react-bootstrap";
import { handleAddHoverStep } from "../background/actions";
import { connect } from "react-redux";

function ManualSteps({ handleAddHoverStep }) {
  return (
    <div className="mt-3 mb-2">
      <span className="mr-2">Add new:</span>
      <Button onClick={handleAddHoverStep} variant="outline-dark" size="sm">
        Hover
      </Button>
    </div>
  );
}

const mapStateToProps = () => ({});
const mapDispatchToProps = dispatch => ({
  handleAddHoverStep: () => dispatch(handleAddHoverStep())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManualSteps);
