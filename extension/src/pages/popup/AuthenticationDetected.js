import { Button, Alert } from "react-bootstrap";
import React from "react";

function AuthenticationDetected({ onConfirm }) {
  return (
    <Alert variant="info">
      <Alert.Heading>Authentication detected</Alert.Heading>
      <p>
        It looks like you're recording a run behind some authentication. Please
        confirm and we'll take care of the rest.
      </p>
      <hr></hr>
      <div className="d-flex justify-content-end">
        <Button variant="outline-info" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </Alert>
  );
}

export default AuthenticationDetected;
