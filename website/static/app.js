// Helper to render a table from an array of objects
function renderTable(tableId, data) {
  const table = document.getElementById(tableId);
  if (!data || data.length === 0) {
    table.innerHTML = "<tr><td>No data</td></tr>";
    return;
  }
  const headers = Object.keys(data[0]);
  table.innerHTML =
    "<thead><tr>" +
    headers.map((h) => `<th>${h}</th>`).join("") +
    "</tr></thead>" +
    "<tbody>" +
    data
      .map(
        (row) =>
          "<tr>" +
          headers
            .map((h) => {
              const value = row[h];
              if (Array.isArray(value)) {
                return `<td><ul style="margin:0;padding-left:1.2em;">${value
                  .map((v) => `<li>${v === null ? "" : v}</li>`)
                  .join("")}</ul></td>`;
              } else {
                return `<td>${value === null ? "" : value}</td>`;
              }
            })
            .join("") +
          "</tr>"
      )
      .join("") +
    "</tbody>";
}

// 1. Raw Data Table
fetch("/api/raw_data")
  .then((r) => r.json())
  .then((data) => renderTable("rawDataTable", data));

// 2. Deposited Column Table
fetch("/api/deposited_column")
  .then((r) => r.json())
  .then((data) => renderTable("depositedColumnTable", data));

// 3. Histogram of Deposited (USD million current)
fetch("/api/deposited_column")
  .then((r) => r.json())
  .then((data) => {
    const values = data
      .map((row) => row["Deposited (USD million current)"])
      .filter((v) => v != null);
    // Simple histogram binning
    const binCount = 20;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binSize = (max - min) / binCount;
    const bins = Array(binCount).fill(0);
    values.forEach((v) => {
      let idx = Math.floor((v - min) / binSize);
      if (idx === binCount) idx = binCount - 1;
      bins[idx]++;
    });
    const labels = Array(binCount)
      .fill(0)
      .map(
        (_, i) =>
          `${(min + i * binSize).toFixed(1)}-${(
            min +
            (i + 1) * binSize
          ).toFixed(1)}`
      );
    new Chart(document.getElementById("histogramChart"), {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Frequency",
            data: bins,
            backgroundColor: "skyblue",
          },
        ],
      },
      options: {
        scales: {
          x: { ticks: { color: "#fff" } },
          y: { ticks: { color: "#fff" } },
        },
      },
    });
  });

// 4. Bar Chart: by Contributor
fetch("/api/by_contributor")
  .then((r) => r.json())
  .then((data) => {
    const labels = data.map((row) => row["Contributor"]);
    const values = data.map((row) => row["Deposited (USD million current)"]);
    new Chart(document.getElementById("byContributorChart"), {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Deposited (USD million current)",
            data: values,
            backgroundColor: "seagreen",
          },
        ],
      },
      options: {
        indexAxis: "x",
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
      },
    });
  });

// 5. Table: by Contributor (with math)
fetch("/api/by_contributor_math")
  .then((r) => r.json())
  .then((data) => renderTable("byContributorMathTable", data));

// 6. Bar Chart: by Contributor (cleaned)
fetch("/api/by_contributor_clean")
  .then((r) => r.json())
  .then((data) => {
    const labels = data.map((row) => row["Contributor_clean"]);
    const values = data.map((row) => row["Deposited (USD million current)"]);
    new Chart(document.getElementById("byContributorCleanChart"), {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Deposited (USD million current)",
            data: values,
            backgroundColor: "seagreen",
          },
        ],
      },
      options: {
        indexAxis: "x",
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
      },
    });
  });

// 7. Table: by Contributor (cleaned, with math)
fetch("/api/by_contributor_clean_math")
  .then((r) => r.json())
  .then((data) => renderTable("byContributorCleanMathTable", data));

// SDG Count by Country Chart
fetch("/api/sdg_count_by_country")
  .then((r) => r.json())
  .then((data) => {
    if (!Array.isArray(data) || data.length === 0) return;
    const labels = data.map((row) => row["Country"]);
    const values = data.map((row) => row["SDG_Count"]);
    new Chart(document.getElementById("sdgCountChart"), {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Number of SDGs Addressed",
            data: values,
            backgroundColor: "royalblue",
          },
        ],
      },
      options: {
        indexAxis: "x",
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
      },
    });
  });

// SDG Count by Country (same order as byContributorCleanChart)
Promise.all([
  fetch("/api/by_contributor_clean").then((r) => r.json()),
  fetch("/api/sdg_count_by_country").then((r) => r.json()),
]).then(([depositData, sdgData]) => {
  if (!Array.isArray(depositData) || depositData.length === 0) return;
  const countryOrder = depositData.map((row) => row["Contributor_clean"]);
  // Build a map from country to SDG count
  const sdgMap = {};
  sdgData.forEach((row) => {
    sdgMap[row["Country"]] = row["SDG_Count"];
  });
  // Align SDG counts to the country order, defaulting to 0 if missing
  const sdgCounts = countryOrder.map((c) => sdgMap[c] || 0);
  new Chart(document.getElementById("sdgCountByContributorOrderChart"), {
    type: "bar",
    data: {
      labels: countryOrder,
      datasets: [
        {
          label: "Number of SDGs Addressed",
          data: sdgCounts,
          backgroundColor: "royalblue",
        },
      ],
    },
    options: {
      indexAxis: "x",
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
    },
  });
});
