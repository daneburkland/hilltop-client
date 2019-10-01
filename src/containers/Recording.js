import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { handleFetchRecording, handleRunTest } from "../actions";

function Recording({ match, handleFetchRecording, handleRunTest, recording }) {
  useEffect(() => {
    handleFetchRecording(match.params.id);
  }, []);

  return (
    !!recording && (
      <>
        <div>
          <h3>code:</h3>
          <pre>
            <code>{recording.puppeteerCode}</code>
          </pre>
        </div>
        <div>
          <h3>jest code:</h3>
          <pre>
            <code>{recording.jestCode}</code>
          </pre>
          <Button
            onClick={() => handleRunTest(recording.jestCode)}
            variant="primary"
          >
            Run
          </Button>
        </div>
      </>
    )
  );
}

const mapStateToProps = ({ main: { recording } }) => ({ recording });
const mapDispatchToProps = dispatch => ({
  handleFetchRecording: id => dispatch(handleFetchRecording(id)),
  handleRunTest: code => dispatch(handleRunTest(code))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Recording);
