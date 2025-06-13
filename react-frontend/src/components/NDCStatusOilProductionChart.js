import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const CSV_URL =
  "https://ourworldindata.org/grapher/oil-production-by-country.csv?v=1&csvType=full&useColumnShortNames=false";

function parseCSV(text) {
  const lines = text.split("\n");
  const headers = lines[0].split(",");
  const rows = lines.slice(1).map((line) => {
    const values = line.split(",");
    const obj = {};
    headers.forEach(
      (h, i) => (obj[h.trim()] = values[i] ? values[i].trim() : "")
    );
    return obj;
  });
  // Keep only the most recent year for each country
  const latest = {};
  rows.forEach((row) => {
    if (!row["Entity"] || !row["Year"]) return;
    const year = parseInt(row["Year"], 10);
    if (!latest[row["Entity"]] || year > latest[row["Entity"]].Year) {
      latest[row["Entity"]] = { ...row, Year: year };
    }
  });
  return Object.values(latest);
}

export default function NDCStatusOilProductionChart({ ndcStatusPoints }) {
  const [oilData, setOilData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(CSV_URL)
      .then((res) => res.text())
      .then((text) => setOilData(parseCSV(text)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (!ndcStatusPoints || ndcStatusPoints.length === 0)
    return <p>No NDC data available.</p>;
  if (loading) return <p>Loading oil production data...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  // Sort NDC data by points ascending, get country order
  const sorted = [...ndcStatusPoints].sort((a, b) => a.Points - b.Points);
  const labels = sorted.map((row) => row.Country);
  const ndcValues = sorted.map((row) => row.Points);
  const bgColors = sorted.map((row) => {
    if (row.Points === 1) return "#2ecc40"; // green
    if (row.Points === 0.75) return "#ffe066"; // yellow
    if (row.Points === 0.5) return "#ffa502"; // orange
    if (row.Points === 0.25) return "#ff4136"; // red
    return "#888"; // gray
  });

  // Map oil production to the same country order
  const oilMap = {};
  oilData.forEach((row) => {
    oilMap[row["Entity"]] = row["Oil production (TWh)"];
  });
  const oilValues = labels.map((country) => {
    const val = oilMap[country];
    return val && !isNaN(Number(val)) ? Number(val) : 0;
  });

  // Chart data for NDC Status Points
  const ndcChartData = {
    labels,
    datasets: [
      {
        label: "NDC Status Points",
        data: ndcValues,
        backgroundColor: bgColors,
      },
    ],
  };
  // Chart data for Oil Production
  const oilChartData = {
    labels,
    datasets: [
      {
        label: "Oil production (TWh)",
        data: oilValues,
        backgroundColor: "#4a90e2",
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
    <div className="dashboard-row">
      <div className="dashboard-col">
        <h2>NDC Status Points by Country</h2>
        <Bar
          data={ndcChartData}
          options={{
            ...options,
            scales: {
              ...options.scales,
              y: { ...options.scales.y, min: 0, max: 1 },
            },
          }}
        />
      </div>
      <div className="dashboard-col">
        <h2>Oil Production (TWh) by Country</h2>
        <Bar data={oilChartData} options={options} />
      </div>
    </div>
  );
}
