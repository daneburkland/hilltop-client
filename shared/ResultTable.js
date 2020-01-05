import React from "react";
import { Table } from "react-bootstrap";
import format from "date-fns/format";
import fromUnixTime from "date-fns/fromUnixTime";
import Performance from "./Performance";

function ResultRow({ result, result: { createdAt, measurements = {} } }) {
  return (
    <tr>
      <td>
        {!!createdAt
          ? format(
              fromUnixTime(Math.floor(createdAt / 1000) + 60 * 60 * 8),
              "EEEE MMM do h:mma z"
            )
          : null}
      </td>
      <td>
        <Performance result={result} />
      </td>
      <td>{measurements.JSEventListeners}</td>
      <td>{measurements.JSHeapUsedSize}</td>
      <td>{measurements.LayoutCount}</td>
      <td>{measurements.LayoutDuration}</td>
      <td>{measurements.Nodes}</td>
      <td>{measurements.RecalcStyleCount}</td>
      <td>{measurements.RecalcStyleDuration}</td>
      <td>{measurements.ScriptDuration}</td>
      <td>{measurements.TaskDuration}</td>
    </tr>
  );
}

function ResultTable({ results }) {
  return (
    <div className="results mb-4">
      <h3>Results:</h3>
      <Table responsive>
        <thead>
          <th>createdAt</th>
          <th>Tracing</th>
          <th>JSEventListeners</th>
          <th>JSHeapUsedSize</th>
          <th>LayoutCount</th>
          <th>LayoutDuration</th>
          <th>Nodes</th>
          <th>RecalcStyleCount</th>
          <th>RecalcStyleDuration</th>
          <th>ScriptDuration</th>
          <th>TaskDuration</th>
        </thead>
        <tbody>
          {results.map((result, i) => (
            <ResultRow key={i} result={result} />
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default ResultTable;
