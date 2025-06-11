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

function SDGCountByContributorOrderChart({ contributorData, sdgData }) {
  if (
    !contributorData ||
    !sdgData ||
    contributorData.length === 0 ||
    sdgData.length === 0
  )
    return <p>No data available.</p>;
  const countryOrder = contributorData.map((row) => row["Contributor_clean"]);
  const sdgMap = {};
  sdgData.forEach((row) => {
    sdgMap[row["Country"]] = row["SDG_Count"];
  });
  const sdgCounts = countryOrder.map((c) => sdgMap[c] || 0);
  const chartData = {
    labels: countryOrder,
    datasets: [
      {
        label: "Number of SDGs Addressed",
        data: sdgCounts,
        backgroundColor: "royalblue",
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

export default SDGCountByContributorOrderChart;
