import React from "react";

function RawDataTable({ data }) {
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
            {Object.keys(data[0]).map((col) => (
              <th key={col} style={{ background: "#333", padding: 4 }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {Object.values(row).map((val, j) => (
                <td key={j} style={{ padding: 4 }}>
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RawDataTable;
