// import React from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Label,
//   LabelList,
// } from "recharts";

// const formatNumber = (n) => n.toLocaleString(); // 96000000 -> "96,000,000"

// const DonationSummaryChart = ({propData}) => {
//   // console.log("propData", propData);
//   // return;
//   if(propData?.totalRemainingAll < 0 ) {
// propData.totalRemainingAll= 0
//   }
//   const data = [
//     {
//       name: "Budgeted",
//       value: propData?.totalRequiredAll,
//       color: "#0074B8", // blue
//     },
//     {
//       name: "Received / Pledge",
//       value: propData?.totalCollectedAll,
//       color: "#F5A623", // yellow/orange
//     },
//     {
//       name: "Balance",
//       value: propData?.totalRemainingAll,
//       color: "#2E8B57", // green
//     },
//   ];
  

// // console.log("DonationSummaryChart data:", data);
//   return (
//     <div style={{ width: "100%", height: 300, background: "#3b3b3b", padding: 16, overflowX: "hidden", minHeight: 300, minWidth: 0 }}>
//       <h3 style={{ color: "#fff", textAlign: "center", marginBottom: 8 }}>
//         Total Donation Summary
//       </h3>

//       <div style={{ width: "100%", height: "calc(100% - 40px)", minHeight: 0, minWidth: 0 }}>
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#777" />
//           <XAxis dataKey="name" stroke="#fff" />
//           <YAxis
//             stroke="#fff"
//             tickFormatter={formatNumber}
//           />
//           <Tooltip
//             formatter={(value) => formatNumber(value)}
//             contentStyle={{ backgroundColor: "#222", border: "none", color: "#fff" }}
//           />
//           {/* Bars */}
//           <Bar dataKey="value" name="Amount" fill="#0074b8">
//             {/* Show numbers on top of bars */}
//             <LabelList
//               dataKey="value"
//               position="top"
//               formatter={formatNumber}
//               style={{ fill: "#fff", fontSize: 12, fontWeight: "bold" }}
//             />
//           </Bar>
//         </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default DonationSummaryChart;


import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";

const formatNumber = (n) =>
  typeof n === "number" ? n.toLocaleString() : n;

const DonationSummaryChart = ({ propData }) => {
  const totalRequiredAll = propData?.totalRequiredAll ?? 0;
  const totalCollectedAll = propData?.totalCollectedAll ?? 0;
  const totalRemainingAllRaw = propData?.totalRemainingAll ?? 0;
  const totalRemainingAll =
    totalRemainingAllRaw < 0 ? 0 : totalRemainingAllRaw;

  const data = [
    {
      name: "Budgeted",
      value: totalRequiredAll,
      color: "#0074B8", // blue
    },
    {
      name: "Received / Pledge",
      value: totalCollectedAll,
      color: "#F5A623", // yellow/orange
    },
    {
      name: "Balance",
      value: totalRemainingAll,
      color: "#2E8B57", // green
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: 300,
        background: "#3b3b3b",
        padding: 16,
        overflowX: "hidden",
        minHeight: 300,
        minWidth: 0,
      }}
    >
      <h3
        style={{
          color: "#fff",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        Total Donation Summary
      </h3>

      <div
        style={{
          width: "100%",
          height: "calc(100% - 40px)",
          minHeight: 0,
          minWidth: 0,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#777" />

            <XAxis
              dataKey="name"
              stroke="#fff"
              tick={{ fill: "#fff" }} // ✔ text color
            />

            <YAxis
              stroke="#fff"
              tickFormatter={formatNumber}
              tick={{ fill: "#fff" }} // ✔ text color
            />

            <Tooltip
              formatter={(value) => formatNumber(value)}
              contentStyle={{
                backgroundColor: "#222",
                border: "none",
                color: "#fff",
              }}
            />

            <Bar dataKey="value" name="Amount">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color} // ✔ per-bar color from data
                />
              ))}

              <LabelList
                dataKey="value"
                position="top"
                formatter={formatNumber}
                fill="#fff"
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DonationSummaryChart;
