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
import DepositedByCountryChart from "./components/DepositedByCountryChart";
import DepositedByCountryTable from "./components/DepositedByCountryTable";
import DepositedByCountryCleanChart from "./components/DepositedByCountryCleanChart";
import DepositedByCountryCleanTable from "./components/DepositedByCountryCleanTable";
import NDCStatusPointsChart from "./components/NDCStatusPointsChart";

function App() {
  const [rawData, setRawData] = useState([]);
  const [depositedColumn, setDepositedColumn] = useState([]);
  const [byContributor, setByContributor] = useState([]);
  const [byContributorMath, setByContributorMath] = useState([]);
  const [byContributorClean, setByContributorClean] = useState([]);
  const [byContributorCleanMath, setByContributorCleanMath] = useState([]);
  const [sdgCountByCountry, setSdgCountByCountry] = useState([]);
  const [byCountry, setByCountry] = useState([]);
  const [byCountryMath, setByCountryMath] = useState([]);
  const [byCountryClean, setByCountryClean] = useState([]);
  const [byCountryCleanMath, setByCountryCleanMath] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCountryTables, setShowCountryTables] = useState(true);
  const [showContributorTables, setShowContributorTables] = useState(true);
  const [showCountryCharts, setShowCountryCharts] = useState(true);
  const [showContributorCharts, setShowContributorCharts] = useState(true);
  const [showSDG, setShowSDG] = useState(true);
  const [showRawData, setShowRawData] = useState(true);
  const [ndcStatusTable, setNdcStatusTable] = useState([]);
  const [ndcStatusPoints, setNdcStatusPoints] = useState([]);
  const [depositedByNdcStatusCountries, setDepositedByNdcStatusCountries] =
    useState([]);
  const [showNdcStatusSection, setShowNdcStatusSection] = useState(true);
  const [ndcStatusPointsOverlap, setNdcStatusPointsOverlap] = useState([]);
  const [
    depositedByNdcStatusCountriesOverlapOrder,
    setDepositedByNdcStatusCountriesOverlapOrder,
  ] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/raw_data").then((r) => r.json()),
      fetch("/api/deposited_column").then((r) => r.json()),
      fetch("/api/by_contributor").then((r) => r.json()),
      fetch("/api/by_contributor_math").then((r) => r.json()),
      fetch("/api/by_contributor_clean").then((r) => r.json()),
      fetch("/api/by_contributor_clean_math").then((r) => r.json()),
      fetch("/api/sdg_count_by_country").then((r) => r.json()),
      fetch("/api/by_country").then((r) => r.json()),
      fetch("/api/by_country_math").then((r) => r.json()),
      fetch("/api/by_country_clean").then((r) => r.json()),
      fetch("/api/by_country_clean_math").then((r) => r.json()),
      fetch("/api/ndc_status_table")
        .then((r) => r.json())
        .then(setNdcStatusTable),
      fetch("/api/ndc_status_points_chart")
        .then((r) => r.json())
        .then(setNdcStatusPoints),
      fetch("/api/deposited_by_ndc_status_countries")
        .then((r) => r.json())
        .then(setDepositedByNdcStatusCountries),
      fetch("/api/ndc_status_points_chart_overlap")
        .then((r) => r.json())
        .then(setNdcStatusPointsOverlap),
      fetch("/api/deposited_by_ndc_status_countries_overlap_order")
        .then((r) => r.json())
        .then(setDepositedByNdcStatusCountriesOverlapOrder),
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
          byCountry,
          byCountryMath,
          byCountryClean,
          byCountryCleanMath,
          ndcStatusTable,
          ndcStatusPoints,
          depositedByNdcStatusCountries,
          ndcStatusPointsOverlap,
          depositedByNdcStatusCountriesOverlapOrder,
        ]) => {
          setRawData(rawData);
          setDepositedColumn(depositedColumn);
          setByContributor(byContributor);
          setByContributorMath(byContributorMath);
          setByContributorClean(byContributorClean);
          setByContributorCleanMath(byContributorCleanMath);
          setSdgCountByCountry(sdgCountByCountry);
          setByCountry(byCountry);
          setByCountryMath(byCountryMath);
          setByCountryClean(byCountryClean);
          setByCountryCleanMath(byCountryCleanMath);
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
        <h1>NDC Analysis</h1>
        {loading && <p>Loading data...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {!loading && !error && (
          <>
            {/* Top grid: Raw Data Table, Deposited Column Table, Histogram */}
            <section>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 8,
                }}>
                <button
                  onClick={() => setShowRawData((v) => !v)}
                  style={{ marginRight: 8 }}>
                  {showRawData ? "−" : "+"}
                </button>
                <h2 style={{ margin: 0 }}>Raw Data & Histogram</h2>
              </div>
              <div
                className="collapsible-content"
                style={{
                  maxHeight: showRawData ? 2000 : 0,
                  opacity: showRawData ? 1 : 0,
                  overflow: "hidden",
                  transition:
                    "max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s cubic-bezier(0.4,0,0.2,1)",
                }}>
                {showRawData && (
                  <div className="dashboard-row">
                    <div className="dashboard-col">
                      <h2>All Deposited (USD million current) Data</h2>
                      <RawDataTable data={rawData} />
                    </div>
                    <div className="dashboard-col">
                      <h2>Deposited (USD million current) Data</h2>
                      <DepositedColumnTable data={depositedColumn} />
                    </div>
                    <div className="dashboard-col">
                      <h2>Distribution of Deposited (USD million current)</h2>
                      <DepositedHistogram data={depositedColumn} />
                    </div>
                  </div>
                )}
              </div>
            </section>
            {/* All Tables Section - split horizontally */}
            <section>
              {/* Country Tables Half */}
              <div style={{ marginBottom: 24 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 8,
                  }}>
                  <button
                    onClick={() => setShowCountryTables((v) => !v)}
                    style={{ marginRight: 8 }}>
                    {showCountryTables ? "−" : "+"}
                  </button>
                  <h2 style={{ margin: 0 }}>Country Tables</h2>
                </div>
                <div
                  className="collapsible-content"
                  style={{
                    maxHeight: showCountryTables ? 2000 : 0,
                    opacity: showCountryTables ? 1 : 0,
                    overflow: "hidden",
                    transition:
                      "max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s cubic-bezier(0.4,0,0.2,1)",
                  }}>
                  {showCountryTables && (
                    <div className="dashboard-row">
                      <div className="dashboard-col">
                        <h2>
                          Table: Total Deposited (USD million current) by
                          Country (with math)
                        </h2>
                        <DepositedByCountryTable data={byCountryMath} />
                      </div>
                      <div className="dashboard-col">
                        <h2>
                          Table: Total Deposited (USD million current) by
                          Country (with math, cleaned)
                        </h2>
                        <DepositedByCountryCleanTable
                          data={byCountryCleanMath}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Contributor Tables Half */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 8,
                  }}>
                  <button
                    onClick={() => setShowContributorTables((v) => !v)}
                    style={{ marginRight: 8 }}>
                    {showContributorTables ? "−" : "+"}
                  </button>
                  <h2 style={{ margin: 0 }}>Contributor Tables</h2>
                </div>
                <div
                  className="collapsible-content"
                  style={{
                    maxHeight: showContributorTables ? 2000 : 0,
                    opacity: showContributorTables ? 1 : 0,
                    overflow: "hidden",
                    transition:
                      "max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s cubic-bezier(0.4,0,0.2,1)",
                  }}>
                  {showContributorTables && (
                    <div className="dashboard-row">
                      <div className="dashboard-col">
                        <h2>
                          Table: Total Deposited (USD million current) by
                          Contributor (with math)
                        </h2>
                        <DepositedByContributorTable data={byContributorMath} />
                      </div>
                      <div className="dashboard-col">
                        <h2>
                          Table: Total Deposited (USD million current) by
                          Contributor (with math, cleaned)
                        </h2>
                        <DepositedByContributorCleanTable
                          data={byContributorCleanMath}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
            {/* All Charts Section - split horizontally */}
            <section>
              {/* Country Charts Half */}
              <div style={{ marginBottom: 24 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 8,
                  }}>
                  <button
                    onClick={() => setShowCountryCharts((v) => !v)}
                    style={{ marginRight: 8 }}>
                    {showCountryCharts ? "−" : "+"}
                  </button>
                  <h2 style={{ margin: 0 }}>Country Charts</h2>
                </div>
                <div
                  className="collapsible-content"
                  style={{
                    maxHeight: showCountryCharts ? 2000 : 0,
                    opacity: showCountryCharts ? 1 : 0,
                    overflow: "hidden",
                    transition:
                      "max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s cubic-bezier(0.4,0,0.2,1)",
                  }}>
                  {showCountryCharts && (
                    <div className="dashboard-row">
                      <div className="dashboard-col">
                        <h2>
                          Total Deposited (USD million current) by Country
                        </h2>
                        <DepositedByCountryChart data={byCountry} />
                      </div>
                      <div className="dashboard-col">
                        <h2>
                          Total Deposited (USD million current) by Country
                          (cleaned)
                        </h2>
                        <DepositedByCountryCleanChart data={byCountryClean} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Contributor Charts Half */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 8,
                  }}>
                  <button
                    onClick={() => setShowContributorCharts((v) => !v)}
                    style={{ marginRight: 8 }}>
                    {showContributorCharts ? "−" : "+"}
                  </button>
                  <h2 style={{ margin: 0 }}>Contributor Charts</h2>
                </div>
                <div
                  className="collapsible-content"
                  style={{
                    maxHeight: showContributorCharts ? 2000 : 0,
                    opacity: showContributorCharts ? 1 : 0,
                    overflow: "hidden",
                    transition:
                      "max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s cubic-bezier(0.4,0,0.2,1)",
                  }}>
                  {showContributorCharts && (
                    <div className="dashboard-row">
                      <div className="dashboard-col">
                        <h2>
                          Total Deposited (USD million current) by Contributor
                        </h2>
                        <DepositedByContributorChart data={byContributor} />
                      </div>
                      <div className="dashboard-col">
                        <h2>
                          Total Deposited (USD million current) by Contributor
                          (cleaned)
                        </h2>
                        <DepositedByContributorCleanChart
                          data={byContributorClean}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
            {/* SDG Charts by Country Section with minimize */}
            <section>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 8,
                }}>
                <button
                  onClick={() => setShowSDG((v) => !v)}
                  style={{ marginRight: 8 }}>
                  {showSDG ? "−" : "+"}
                </button>
                <h2 style={{ margin: 0 }}>SDG Charts by Country</h2>
              </div>
              <div
                className="collapsible-content"
                style={{
                  maxHeight: showSDG ? 2000 : 0,
                  opacity: showSDG ? 1 : 0,
                  overflow: "hidden",
                  transition:
                    "max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s cubic-bezier(0.4,0,0.2,1)",
                }}>
                {showSDG && (
                  <div className="dashboard-row">
                    <div className="dashboard-col">
                      <h2>Number of SDGs Addressed by Country (same order)</h2>
                      <SDGCountByContributorOrderChart
                        contributorData={byContributorClean}
                        sdgData={sdgCountByCountry}
                      />
                    </div>
                    <div className="dashboard-col">
                      <h2>
                        Number of SDGs Addressed by Country (all countries)
                      </h2>
                      <SDGCountByCountryChart data={sdgCountByCountry} />
                    </div>
                  </div>
                )}
              </div>
            </section>
            {/* NDC Status Section */}
            <section>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 8,
                }}>
                <button
                  onClick={() => setShowNdcStatusSection((v) => !v)}
                  style={{ marginRight: 8 }}>
                  {showNdcStatusSection ? "−" : "+"}
                </button>
                <h2 style={{ margin: 0 }}>
                  NDC Status Comparison (NewClimate Data)
                </h2>
              </div>
              <div
                className="collapsible-content"
                style={{
                  maxHeight: showNdcStatusSection ? 2000 : 0,
                  opacity: showNdcStatusSection ? 1 : 0,
                  overflow: "hidden",
                  transition:
                    "max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s cubic-bezier(0.4,0,0.2,1)",
                }}>
                {showNdcStatusSection && (
                  <>
                    <div style={{ marginBottom: 32 }}>
                      <RawDataTable data={ndcStatusTable} />
                    </div>
                    <div className="dashboard-row">
                      <div className="dashboard-col">
                        <h2>NDC Status Points by Country</h2>
                        <NDCStatusPointsChart data={ndcStatusPoints} />
                      </div>
                      <div className="dashboard-col">
                        <h2>
                          Total Deposited (USD million current) by Country (NDC
                          Status Countries Only)
                        </h2>
                        <DepositedByCountryChart
                          data={depositedByNdcStatusCountries}
                        />
                      </div>
                    </div>
                    <div className="dashboard-row">
                      <div className="dashboard-col">
                        <h2>
                          NDC Status Points by Country (Overlap Only, Ordered)
                        </h2>
                        <NDCStatusPointsChart data={ndcStatusPointsOverlap} />
                      </div>
                      <div
                        className="dashboard-col"
                        style={{ minWidth: 400, maxWidth: "100%" }}>
                        <h2>
                          Total Deposited (USD million current) by Country
                          (Overlap Only, Ordered)
                        </h2>
                        <DepositedByCountryChart
                          data={depositedByNdcStatusCountriesOverlapOrder}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
