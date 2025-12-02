// ...existing code...
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0074B8", "#F5A623"]; // Cash, Pledge
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

const DonationTypePieChart = ({ donations: propDonations, data }) => {
  // Use donations prop if provided, otherwise accept `data` prop (many parents use `data`)
  // If neither provided, fetch from API
  const [donations, setDonations] = useState(
    Array.isArray(propDonations) ? propDonations : Array.isArray(data) ? data : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // If parent passes donations or data, keep using that (sync updates)
    if (Array.isArray(propDonations)) {
      setDonations(propDonations);
      return;
    }
    if (Array.isArray(data)) {
      setDonations(data);
      return;
    }

    // Otherwise fetch from API
    let mounted = true;
    const fetchDonations = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${API_BASE}/donations`);
        if (mounted) setDonations(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("DonationTypePieChart fetch error:", err);
        if (mounted) setError("Failed to load donations");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDonations();
    return () => {
      mounted = false;
    };
  }, [propDonations, data]);

  // Show loading / error inline but keep layout unchanged
  if (loading) {
    return (
      <section
        style={{
          width: "100vw",
          maxWidth: "100vw",
          height: 420,
          padding: 16,
          boxSizing: "border-box",
          background: "radial-gradient(circle, #4B4B4B 0, #2F2F2F 70%)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        <p>Loading donation types…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section
        style={{
          width: "100vw",
          maxWidth: "100vw",
          height: 420,
          padding: 16,
          boxSizing: "border-box",
          background: "radial-gradient(circle, #4B4B4B 0, #2F2F2F 70%)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        <p style={{ color: "salmon" }}>{error}</p>
      </section>
    );
  }

  // Aggregate only Cash and Pledge as before
  const types = ["Cash", "Pledge"];
  const donationsByType = { Cash: 0, Pledge: 0 };
  const source = Array.isArray(donations) ? donations : [];

  source.forEach((donation) => {
    const raw = donation.donationType || donation.donation_type || "";
    const s = String(raw).toLowerCase();
    if (s.includes("cash")) {
      donationsByType.Cash += Number(donation.amount) || 0;
    } else if (s.includes("pledge")) {
      donationsByType.Pledge += Number(donation.amount) || 0;
    }
    // other types ignored per original behavior
  });

  const total = donationsByType.Cash + donationsByType.Pledge;
  const dataToShow = types.map((key) => ({
    name: key,
    value: donationsByType[key] || 0,
    percent: total > 0 ? ((donationsByType[key] || 0) / total) * 100 : 0,
  }));
  const displayData = total > 0 ? dataToShow : [{ name: "No data", value: 0, percent: 0 }];

  return (
    <section
      style={{
        width: "100vw",
        maxWidth: "100vw",
        height: 420,
        padding: 16,
        boxSizing: "border-box",
        background: "radial-gradient(circle, #4B4B4B 0, #2F2F2F 70%)",
        overflow: "hidden",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#fff",
          marginTop: 4,
          marginBottom: 12,
          letterSpacing: 2,
          fontWeight: "700",
        }}
      >
        Donation Type wise Summary
      </h2>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={displayData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="70%"
            paddingAngle={1}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {displayData.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;
              const p = payload[0].payload;
              return (
                <div style={{ background: "#222", color: "#fff", padding: 8, borderRadius: 4 }}>
                  <div style={{ fontWeight: 700 }}>{p.name}</div>
                  <div>Rs {Number(p.value).toLocaleString("en-PK")}</div>
                  <div>{p.percent ? p.percent.toFixed(1) : 0}%</div>
                </div>
              );
            }}
            wrapperStyle={{}}
          />
          <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ color: "#fff" }} />
        </PieChart>
      </ResponsiveContainer>
    </section>
  );
};

export default DonationTypePieChart;
// ...existing code...