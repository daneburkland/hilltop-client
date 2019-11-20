import React, { useEffect, useState } from "react";
import { Table, Badge } from "react-bootstrap";
import Loader from "shared/Loader";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";

function RecordingRow({
  recording: { name, location, isActive, recordingId, latestResult = {} }
}) {
  const { error } = latestResult;

  return (
    <LinkContainer key={recordingId} to={`/recording/${recordingId}`}>
      <tr>
        <td>{name}</td>
        <td>{location.host}</td>
        <td>
          <Badge variant={!!error ? "danger" : "success"}>
            {!!error ? "Failing" : "OK"}
          </Badge>
        </td>
        <td>
          <Badge variant={isActive ? "primary" : "warning"}>
            {isActive ? "Active" : "Paused"}
          </Badge>
        </td>
      </tr>
    </LinkContainer>
  );
}

function RecordingList() {
  const [recordings, setRecordings] = useState([]);
  const [isLoading, setIsLoading] = useState(null);

  async function fetchRecordings() {
    setIsLoading(true);
    const recordings = await API.get("recordings", "/recordings");
    setRecordings(recordings);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchRecordings();
  }, []);
  const sortedRecordings = recordings.sort((a, b) => b.createdAt - a.createdAt);
  return (
    <div className="recordings">
      <h1>Your Recordings</h1>
      <Table>
        <thead>
          <th>Name</th>
          <th>Host</th>
          <th>Health</th>
          <th>Status</th>
        </thead>
        {isLoading ? (
          <Loader />
        ) : (
          <tbody>
            {sortedRecordings.map((recording, i) => (
              <RecordingRow key={i} recording={recording} />
            ))}
          </tbody>
        )}
      </Table>
    </div>
  );
}

export default RecordingList;
