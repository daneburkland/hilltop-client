import React from "react";
import format from "date-fns/format";
import fromUnixTime from "date-fns/fromUnixTime";
import LoaderButton from "shared/components/LoaderButton";

function StatusCard({
  isActive,
  nextScheduledTest,
  handleScheduleTest,
  handlePauseTest,
  isUpdatingRecording
}) {
  return (
    <div className="col">
      <div className={`card ${isActive ? "border-primary" : "border-warning"}`}>
        <div className="card-header">Status</div>
        <div className="card-body">
          <h3 className="card-title">{isActive ? "Active" : "Paused"}</h3>
          {nextScheduledTest && (
            <p>
              <span className="mr-1">Next scheduled test:</span>
              <span className="mr-1">approximately</span>
              {format(fromUnixTime(nextScheduledTest), "EEEE MMM do h:mma z")}
            </p>
          )}
          <LoaderButton
            className="mr-3 mt-3"
            isLoading={isUpdatingRecording}
            text={isActive ? "Pause test" : "Enable test"}
            loadingText="Loading..."
            onClick={isActive ? handlePauseTest : handleScheduleTest}
            variant={isActive ? "primary" : "danger"}
          />
        </div>
      </div>
    </div>
  );
}

export default StatusCard;
