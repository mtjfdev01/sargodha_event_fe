import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const formatNumber = (n) => {
  if (!n) return '0';
  return n.toLocaleString();
};

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

const DetailedDonationSummaryChart = () => {
  const [machinesSummary, setMachinesSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${API_BASE}/donations/machines_summary`);
        console.log("res", res?.data);
        if (mounted) setMachinesSummary(res.data || null);
      } catch (err) { 
        console.error("DetailedDonationSummaryChart fetch error:", err);
        if (mounted) setError("Failed to load machines summary");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const machineData = (machinesSummary?.machines || []).map((machine) => ({
    name: machine.machine || 'Unknown',
    targeted: machine.requiredAmount || 0,
    collected: machine.collectedAmount || 0,
    remaining: Math.max(machine.remainingAmount || 0, 0),
  }));
 console.log("machineData", machineData);
  const displayData = machineData.length > 0 ? machineData : [];
console.log("displayData", displayData);
  if (loading) {
    return (
      <div style={{ width: "100%", height: 400, background: "linear-gradient(90deg,#2F2F2F,#4A4A4A)", padding: 16, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", minHeight: 400, minWidth: 0 }}>
        <p>Loading detailed summary…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ width: "100%", height: 400, background: "linear-gradient(90deg,#2F2F2F,#4A4A4A)", padding: 16, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", minHeight: 400, minWidth: 0 }}>
        <p style={{ color: "salmon" }}>{error}</p>
      </div>
    );
  }

  if (displayData.length === 0) {
    return (
      <div style={{ width: "100%", height: 400, background: "linear-gradient(90deg,#2F2F2F,#4A4A4A)", padding: 16, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", minHeight: 400, minWidth: 0 }}>
        <p>No machines summary available</p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: 550,
        background: "linear-gradient(90deg,#2F2F2F,#4A4A4A)",
        padding: 16,
        minHeight: 550,
        minWidth: 0,
      }}
    >
      <h3
        style={{
          color: "#fff",
          textAlign: "center",
          marginBottom: 8,
          letterSpacing: 1,
        }}
      >
        Detailed Summary
      </h3>
      <div style={{ width: "100%", height: "calc(100% - 40px)", minHeight: 0, minWidth: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={displayData}
            margin={{ top: 20, right: 30, left: 40, bottom: 120 }}
          >
          <CartesianGrid strokeDasharray="3 3" stroke="#777" />
          <XAxis
            dataKey="name"
            stroke="#fff"
            interval={0}
            angle={-40}
            textAnchor="end"
            height={120}
          />
          <YAxis
            stroke="#fff"
            tickFormatter={formatNumber}
          />
          <Tooltip
            formatter={(value) => formatNumber(value)}
            contentStyle={{
              backgroundColor: "#222",
              border: "none",
              color: "#fff",
            }}
          />
          <Legend
            wrapperStyle={{ color: "#fff" }}
          />
          <Bar dataKey="targeted" name="Targeted" fill="#0074B8">
            <LabelList
              dataKey="targeted"
              position="top"
              formatter={formatNumber}
              style={{ fill: "#fff", fontSize: 11 }}
            />
          </Bar>
          <Bar dataKey="collected" name="Collected" fill="#F5A623">
            <LabelList
              dataKey="collected"
              position="top"
              formatter={formatNumber}
              style={{ fill: "#fff", fontSize: 11 }}
            />
          </Bar>
          <Bar dataKey="remaining" name="Remaining" fill="#2E8B57">
            <LabelList
              dataKey="remaining"
              position="top"
              formatter={formatNumber}
              style={{ fill: "#fff", fontSize: 11 }}
            />
          </Bar>
        </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DetailedDonationSummaryChart;