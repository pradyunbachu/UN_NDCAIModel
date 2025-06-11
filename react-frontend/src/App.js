import React, { useEffect, useState } from "react";
import "./App.css";
import RawDataTable from "./components/RawDataTable";
import DepositedColumnTable from "./components/DepositedColumnTable";
import DepositedHistogram from "./components/DepositedHistogram";
import DepositedByContributorChart from "./components/DepositedByContributorChart";
import DepositedByContributorTable from "./components/DepositedByContributorTable";
import DepositedByContributorCleanChart from "./components/DepositedByContributorCleanChart";
import DepositedByContributorCleanTable from "./components/DepositedByContributorCleanTable";
import SDGCountByCountryChart from "./components/SDGCountByCountryChart";
import SDGCountByContributorOrderChart from "./components/SDGCountByContributorOrderChart";

function App() {
  const [rawData, setRawData] = useState([]);
  const [depositedColumn, setDepositedColumn] = useState([]);
  const [byContributor, setByContributor] = useState([]);
  const [byContributorMath, setByContributorMath] = useState([]);
  const [byContributorClean, setByContributorClean] = useState([]);
  const [byContributorCleanMath, setByContributorCleanMath] = useState([]);
  const [sdgCountByCountry, setSdgCountByCountry] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/raw_data").then((r) => r.json()),
      fetch("/api/deposited_column").then((r) => r.json()),
      fetch("/api/by_contributor").then((r) => r.json()),
      fetch("/api/by_contributor_math").then((r) => r.json()),
      fetch("/api/by_contributor_clean").then((r) => r.json()),
      fetch("/api/by_contributor_clean_math").then((r) => r.json()),
      fetch("/api/sdg_count_by_country").then((r) => r.json()),
    ])
      .then(
        ([
          rawData,
          depositedColumn,
          byContributor,
          byContributorMath,
          byContributorClean,
          byContributorCleanMath,
          sdgCountByCountry,
        ]) => {
          setRawData(rawData);
          setDepositedColumn(depositedColumn);
          setByContributor(byContributor);
          setByContributorMath(byContributorMath);
          setByContributorClean(byContributorClean);
          setByContributorCleanMath(byContributorCleanMath);
          setSdgCountByCountry(sdgCountByCountry);
          setLoading(false);
        }
      )
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <div className="dashboard-container">
        <h1>Deposited (USD million current) Analysis</h1>
        {loading && <p>Loading data...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {!loading && !error && (
          <>
            <section>
              <h2>All Deposited (USD million current) Data</h2>
              <RawDataTable data={rawData} />
            </section>
            <section>
              <h2>Deposited (USD million current) Data</h2>
              <DepositedColumnTable data={depositedColumn} />
            </section>
            <section>
              <h2>Distribution of Deposited (USD million current)</h2>
              <DepositedHistogram data={depositedColumn} />
            </section>
            <section>
              <div className="dashboard-row">
                <div className="dashboard-col">
                  <h2>Total Deposited (USD million current) by Contributor</h2>
                  <DepositedByContributorChart data={byContributor} />
                </div>
                <div className="dashboard-col">
                  <h2>
                    Table: Total Deposited (USD million current) by Contributor
                    (with math)
                  </h2>
                  <DepositedByContributorTable data={byContributorMath} />
                </div>
              </div>
            </section>
            <section>
              <div className="dashboard-row">
                <div className="dashboard-col">
                  <h2>
                    Total Deposited (USD million current) by Contributor
                    (cleaned)
                  </h2>
                  <DepositedByContributorCleanChart data={byContributorClean} />
                </div>
                <div className="dashboard-col">
                  <h2>
                    Table: Total Deposited (USD million current) by Contributor
                    (with math, cleaned)
                  </h2>
                  <DepositedByContributorCleanTable
                    data={byContributorCleanMath}
                  />
                </div>
              </div>
            </section>
            <section>
              <div className="dashboard-row">
                <div className="dashboard-col">
                  <h2>Number of SDGs Addressed by Country (same order)</h2>
                  <SDGCountByContributorOrderChart
                    contributorData={byContributorClean}
                    sdgData={sdgCountByCountry}
                  />
                </div>
                <div className="dashboard-col">
                  <h2>Number of SDGs Addressed by Country (all countries)</h2>
                  <SDGCountByCountryChart data={sdgCountByCountry} />
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
