import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
  LabelList,
} from "recharts";

const formatNumber = (n) => n.toLocaleString(); // 96000000 -> "96,000,000"

const DonationSummaryChart = ({propData}) => {
  console.log("propData", propData);
  // return;
  if(propData?.totalRemainingAll < 0 ) {
propData.totalRemainingAll= 0
  }
  const data = [
  { name: "Budgeted", value: propData?.totalRequiredAll},
  { name: "Received / Pledge", value: propData?.totalCollectedAll },
  { name: "Balance", value: propData?.totalRemainingAll },
];


console.log("DonationSummaryChart data:", data);
  return (
    <div style={{ width: "100%", height: 300, background: "#3b3b3b", padding: 16, overflowX: "hidden" }}>
      <h3 style={{ color: "#fff", textAlign: "center", marginBottom: 8 }}>
        Total Donation Summary
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#777" />
          <XAxis dataKey="name" stroke="#fff" />
          <YAxis
            stroke="#fff"
            tickFormatter={formatNumber}
          />
          <Tooltip
            formatter={(value) => formatNumber(value)}
            contentStyle={{ backgroundColor: "#222", border: "none", color: "#fff" }}
          />
          {/* Bars */}
          <Bar dataKey="value" name="Amount" fill="#0074b8">
            {/* Show numbers on top of bars */}
            <LabelList
              dataKey="value"
              position="top"
              formatter={formatNumber}
              style={{ fill: "#fff", fontSize: 12, fontWeight: "bold" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DonationSummaryChart;