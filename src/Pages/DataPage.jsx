import { useState, useEffect } from 'react';
import DonationSummaryChart from '../components/donationSummaryChart/DonationSummaryChart';
import DonationTypePieChart from '../components/donationTypePieChart/DonationTypePieChart';
// import DonorReportTable from '../components/donorReportTable/DonorReportTable';
import DetailedDonationSummaryChart from '../components/detailedDonationSummaryChart/DetailedDonationSummaryChart';
import axios from 'axios';

const API_BASE = 'http://localhost:3000';

const DataPage = () => {
  const [donations, setDonations] = useState([]);
  const [machinesSummary, setMachinesSummary] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const donationsRes = await axios.get(`${API_BASE}/donations`);
      setDonations(donationsRes.data);

      const machinesRes = await axios.get(`${API_BASE}/donations/machines/summary`);
      setMachinesSummary(machinesRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  return (
    <div>
      {machinesSummary && <DonationSummaryChart propData={machinesSummary} />}
      <DetailedDonationSummaryChart data={donations} />
      {/* <DonorReportTable data={donations} /> */}
      <DonationTypePieChart data={donations} />
    </div>
  );
};

export default DataPage;
