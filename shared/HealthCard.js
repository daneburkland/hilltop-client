import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Button } from "react-bootstrap";
import format from "date-fns/format";
import fromUnixTime from "date-fns/fromUnixTime";

function HealthCard({ latestResult, recordingId }) {
  const latestResultIsOk = latestResult && !latestResult.error;
  return (
    <div className="col">
      <div
        className={`card ${
          latestResultIsOk ? "border-success" : "border-danger"
        }`}
      >
        <div className="card-header">Health</div>
        <div className="card-body">
          <h3 className="card-title">
            {latestResult.error ? "Failing:" : "OK"}
          </h3>
          {latestResult.createdAt && (
            <p>
              <span>{`Latest result at: ${format(
                fromUnixTime(
                  Math.floor(latestResult.createdAt / 1000) + 60 * 60 * 8
                ),
                "EEEE MMM do h:mma z"
              )}`}</span>
            </p>
          )}
          <p>
            <code>{latestResult.error}</code>
          </p>
          <LinkContainer to={`/editor/${recordingId}`}>
            <Button
              className="mt-3"
              variant={latestResultIsOk ? "success" : "danger"}
            >
              Debug
            </Button>
          </LinkContainer>
        </div>
      </div>
    </div>
  );
}

export default HealthCard;
