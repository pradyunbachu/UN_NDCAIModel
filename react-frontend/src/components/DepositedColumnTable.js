import React from "react";

function DepositedColumnTable({ data }) {
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
              Deposited (USD million current)
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td style={{ padding: 4 }}>
                {row["Deposited (USD million current)"]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DepositedColumnTable;
