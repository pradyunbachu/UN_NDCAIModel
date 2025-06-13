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

export default function OilProductionChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(CSV_URL)
      .then((res) => res.text())
      .then((text) => setData(parseCSV(text)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading oil production chart...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  // Get top 10 by oil production
  const top10 = [...data]
    .filter(
      (row) =>
        row["Oil production (TWh)"] &&
        !isNaN(Number(row["Oil production (TWh)"]))
    )
    .sort(
      (a, b) =>
        Number(b["Oil production (TWh)"]) - Number(a["Oil production (TWh)"])
    )
    .slice(0, 10);

  const chartData = {
    labels: top10.map((row) => row["Entity"]),
    datasets: [
      {
        label: "Oil production (TWh)",
        data: top10.map((row) => Number(row["Oil production (TWh)"])),
        backgroundColor: "#4a90e2",
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
        background: "#23272a",
        borderRadius: 10,
        padding: 16,
        minWidth: 400,
        maxWidth: 600,
      }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
