import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DonorReportTable.css";

const formatPledgeDate = (val) => {
  if (!val) return "-";
  if (typeof val === "string" && val.includes("-")) {
    return val.replace(/-/g, "/");
  }
  if (typeof val === "object") {
    const { dd = 0, mm = 0, yyyy = 0 } = val;
    if (!dd && !mm && !yyyy) return "-";
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(dd)}/${pad(mm)}/${yyyy}`;
  }
  return String(val);
};

const formatAmount = (n) =>
  n ? n.toLocaleString("en-PK", { maximumFractionDigits: 0 }) : "0";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

const DonorReportTable = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${API_BASE}/donations`);
        if (mounted) setDonations(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("DonorReportTable fetch error:", err);
        if (mounted) setError("Failed to load donations");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="report-wrapper">
        <div className="report-card">
          <p style={{ color: "#fff", textAlign: "center" }}>Loading donations…</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="report-wrapper">
        <div className="report-card">
          <p style={{ color: "salmon", textAlign: "center" }}>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="report-wrapper">
      <div className="report-card">
        <header className="report-header">
          <h2>Donor Detailed Report</h2>
          <p className="report-subtitle">Summary of pledges and donations by equipment</p>
        </header>
        <div className="report-table-container">
          <table className="report-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Occupation</th>
                <th>Donor Type</th>
                <th>Contact No.</th>
                <th>Institute / Organization</th>
                <th>Donation For (Equipment)</th>
                <th>Donation Type</th>
                <th>Method / Mode</th>
                <th>Pledge Date</th>
                <th>Amount</th>
                <th>Remaining</th>
              </tr>
            </thead>
            <tbody>
              {donations.length === 0 && (
                <tr>
                  <td colSpan={11} style={{ textAlign: "center", padding: 20 }}>
                    No donations yet
                  </td>
                </tr>
              )}
              {donations.map((d) => {
                const donor = d.donor || {};
                const remaining = 0;
                return (
                  <tr key={d._id || d.id}>
                    <td>{donor.name || "-"}</td>
                    <td>{donor.occupation || "-"}</td>
                    <td>{donor.donorType || "-"}</td>
                    <td>{donor.contactNo || "-"}</td>
                    <td>{donor.instituteOrganization || "-"}</td>
                    <td>{d.donationFor || "-"}</td>
                    <td>{d.donationType || "-"}</td>
                    <td>{d.methodMode || d.method || "-"}</td>
                    <td>{formatPledgeDate(d.pledgeDate)}</td>
                    <td className="numeric">Rs {formatAmount(d.amount)}</td>
                    <td className="numeric">Rs {formatAmount(remaining)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default DonorReportTable;