import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function NDCStatusPointsChart({ data }) {
  if (!data || data.length === 0) return <p>No data available.</p>;
  // Sort by points ascending
  const sorted = [...data].sort((a, b) => a.Points - b.Points);
  const labels = sorted.map((row) => row.Country);
  const values = sorted.map((row) => row.Points);
  const bgColors = sorted.map((row) => {
    if (row.Points === 1) return "#2ecc40"; // green
    if (row.Points === 0.75) return "#ffe066"; // yellow
    if (row.Points === 0.5) return "#ffa502"; // orange
    if (row.Points === 0.25) return "#ff4136"; // red
    return "#888"; // gray
  });
  const chartData = {
    labels,
    datasets: [
      {
        label: "NDC Status Points",
        data: values,
        backgroundColor: bgColors,
      },
    ],
  };
  const options = {
    indexAxis: "x",
    plugins: { legend: { labels: { color: "#fff" } } },
    scales: {
      x: {
        ticks: {
          color: "#fff",
          font: { size: 10 },
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: { ticks: { color: "#fff" }, min: 0, max: 1 },
    },
  };
  return (
    <div
      style={{
        background: "#222",
        borderRadius: 8,
        padding: 16,
        minWidth: 400,
        maxWidth: "100%",
        margin: "0 auto",
      }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default NDCStatusPointsChart;
