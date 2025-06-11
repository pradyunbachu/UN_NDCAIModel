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

function DepositedHistogram({ data }) {
  if (!data || data.length === 0) return <p>No data available.</p>;
  const values = data
    .map((row) => Number(row["Deposited (USD million current)"]))
    .filter((v) => !isNaN(v));
  if (values.length === 0) return <p>No deposited values available.</p>;
  const binCount = 20;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const binSize = (max - min) / binCount || 1;
  const bins = Array(binCount).fill(0);
  values.forEach((v) => {
    let idx = Math.floor((v - min) / binSize);
    if (idx >= binCount) idx = binCount - 1;
    bins[idx] += 1;
  });
  const labels = bins.map(
    (_, i) =>
      `${(min + i * binSize).toFixed(1)}-${(min + (i + 1) * binSize).toFixed(
        1
      )}`
  );
  const chartData = {
    labels,
    datasets: [
      {
        label: "Frequency",
        data: bins,
        backgroundColor: "skyblue",
      },
    ],
  };
  const options = {
    plugins: { legend: { labels: { color: "#fff" } } },
    scales: {
      x: { ticks: { color: "#fff" } },
      y: { ticks: { color: "#fff" } },
    },
  };
  return (
    <div
      style={{
        background: "#222",
        borderRadius: 8,
        padding: 16,
        maxWidth: 700,
        margin: "0 auto",
      }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default DepositedHistogram;
