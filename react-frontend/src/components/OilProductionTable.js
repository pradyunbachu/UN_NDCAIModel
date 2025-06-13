import React, { useEffect, useState } from "react";

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

export default function OilProductionTable() {
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

  if (loading) return <p>Loading oil production data...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ overflowX: "auto", maxHeight: 400 }}>
      <table style={{ width: "100%", color: "#fff", background: "#23272a" }}>
        <thead>
          <tr>
            <th>Country</th>
            <th>Code</th>
            <th>Year</th>
            <th>Oil production (TWh)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td>{row["Entity"]}</td>
              <td>{row["Code"]}</td>
              <td>{row["Year"]}</td>
              <td>{row["Oil production (TWh)"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
