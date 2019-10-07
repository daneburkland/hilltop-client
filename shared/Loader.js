import React from "react";
import { Spinner } from "react-bootstrap";

function Loader() {
  return (
    <div
      style={{ left: 0, right: 0, top: 0, bottom: 0 }}
      className="position-absolute d-flex justify-content-center align-items-center"
    >
      <Spinner animation="border" />
    </div>
  );
}

export default Loader;
