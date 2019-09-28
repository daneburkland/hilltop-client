import React from "react";
import { Alert, Button } from "react-bootstrap";

function AddingHoverStep({ onCancel }) {
  return (
    <Alert variant="secondary">
      <Alert.Heading>Adding hover step</Alert.Heading>
      <p>Click on an element in the page you'd like to hover</p>
      <hr></hr>
      <div className="d-flex justify-content-end">
        <Button variant="outline-secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </Alert>
  );
}

export default AddingHoverStep;
