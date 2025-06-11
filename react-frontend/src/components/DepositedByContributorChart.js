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

function DepositedByContributorChart({ data }) {
  if (!data || data.length === 0) return <p>No data available.</p>;
  const labels = data.map((row) => row["Contributor"]);
  const values = data.map((row) => row["Deposited (USD million current)"]);
  const chartData = {
    labels,
    datasets: [
      {
        label: "Deposited (USD million current)",
        data: values,
        backgroundColor: "seagreen",
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
      y: { ticks: { color: "#fff" } },
    },
  };
  return (
    <div
      style={{
        background: "#222",
        borderRadius: 8,
        padding: 16,
        minWidth: 600,
        maxWidth: "100%",
        margin: "0 auto",
      }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default DepositedByContributorChart;
