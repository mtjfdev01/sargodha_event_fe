import React from "react";
import DonorReportTable from "../components/donorReportTable/DonorReportTable";

const DonorReportPage = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Donor Report</h1>
      <DonorReportTable />
    </div>
  );
};

export default DonorReportPage;