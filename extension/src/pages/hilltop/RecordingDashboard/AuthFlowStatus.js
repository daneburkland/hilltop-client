import React from "react";
import { Alert } from "react-bootstrap";
import Octicon, { ShieldX, ShieldCheck } from "@primer/octicons-react";

function AuthFlowStatus({ authFlow }) {
  const content = !!authFlow
    ? `Authenticated on: ${authFlow.origin}`
    : `Not authenticated`;
  return (
    <div className="d-flex justify-content-between">
      <Alert variant={!!authFlow ? "success" : "warning"} className="mb-0">
        <span className="mr-2">{content}</span>
        <Octicon icon={!!authFlow ? ShieldCheck : ShieldX} />
      </Alert>
    </div>
  );
}

export default AuthFlowStatus;
