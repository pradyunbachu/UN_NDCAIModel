import React from "react";

function DepositedByContributorCleanTable({ data }) {
  if (!data || data.length === 0) return <p>No data available.</p>;
  return (
    <div
      style={{
        maxHeight: 400,
        overflow: "auto",
        background: "#222",
        borderRadius: 8,
        padding: 8,
      }}>
      <table style={{ width: "100%", color: "#fff" }}>
        <thead>
          <tr>
            <th style={{ background: "#333", padding: 4 }}>
              Contributor (Cleaned)
            </th>
            <th style={{ background: "#333", padding: 4 }}>Entries</th>
            <th style={{ background: "#333", padding: 4 }}>Sum Math</th>
            <th style={{ background: "#333", padding: 4 }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td style={{ padding: 4 }}>{row["Contributor_clean"]}</td>
              <td style={{ padding: 4 }}>
                {Array.isArray(row["Entries"])
                  ? row["Entries"].join(", ")
                  : row["Entries"]}
              </td>
              <td style={{ padding: 4 }}>{row["Sum Math"]}</td>
              <td style={{ padding: 4 }}>{row["Total"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DepositedByContributorCleanTable;
