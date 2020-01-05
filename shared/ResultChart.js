import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis
} from "recharts";

function ResultChart({ results }) {
  const measurements = results.map(({ measurements }) => measurements);
  console.log(measurements);
  return (
    <ResponsiveContainer height={600}>
      <LineChart data={measurements}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis />
        <Line type="monotone" dataKey="LayoutDuration" />
        <YAxis />
      </LineChart>
    </ResponsiveContainer>
  );
}
export default ResultChart;
