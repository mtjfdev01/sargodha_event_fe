import { useState, useEffect } from 'react'

import logo from '../../assets/images/only_logo.png';
import "./DonationForm.css";
import axios from 'axios';

const API_BASE = 'http://localhost:3000';

function DonationForm() {
  const [form, setForm] = useState({
    name: '',
    occupation: '',
    donorType: 'Individual',
    contactNo: '',
    organization: '',
    donationFor: 'USG Machine Aplio-400 platinum (Refurb)',
    donationType: 'Cash',
    method: 'Cash',
    pledgeDate: '',
    amount: '',
    remarks: ''
  });

  const [donations, setDonations] = useState([]);
  const [machinesSummary, setMachinesSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch donations
      const donationsRes = await axios.get(`${API_BASE}/donations`);
      console.log('Fetched donations:', donationsRes.data);
      setDonations(donationsRes.data);

      // Fetch machines summary
      const machinesRes = await axios.get(`${API_BASE}/donations/machines/summary`);
      console.log('Fetched machines summary:', machinesRes.data);
      setMachinesSummary(machinesRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data from server');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const formatDateToDDMMYYYY = (isoDate) => {
    if (!isoDate) return '';
    const [y, m, d] = isoDate.split('-');
    return `${d}-${m}-${y}`;
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!form.contactNo.trim()) {
      setError('Contact number is required');
      return false;
    }
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      setError('Amount must be a valid positive number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    const apiPayload = {
      donationFor: form.donationFor,
      donationType: form.donationType,
      methodMode: form.method,
      amount: Number(form.amount),
      pledgeDate: formatDateToDDMMYYYY(form.pledgeDate),
      remarks: form.remarks,
      donor: {
        name: form.name,
        contactNo: form.contactNo,
        occupation: form.occupation,
        donorType: form.donorType,
        instituteOrganization: form.organization
      }
    };

    console.log('Submitting:', apiPayload);
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/donations`, apiPayload);
      console.log('Response:', response.data);
      setSuccess('Donation saved successfully!');
      
      // Reset form
      setForm({
        name: '',
        occupation: '',
        donorType: 'Individual',
        contactNo: '',
        organization: '',
        donationFor: 'USG Machine Aplio-400 platinum (Refurb)',
        donationType: 'Cash',
        method: 'Cash',
        pledgeDate: '',
        amount: '',
        remarks: ''
      });

      // Refresh data
      fetchAllData();
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Failed to save donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <div style={{ background: '#ffcccc', color: '#cc0000', padding: '10px', margin: '10px', borderRadius: '4px' }}>{error}</div>}
      {success && <div style={{ background: '#ccffcc', color: '#00cc00', padding: '10px', margin: '10px', borderRadius: '4px' }}>{success}</div>}

      <div className="wrapper">
        <div className="form-container">

          <div className="form-header">
            <h2>Donation for Aas Lab (Collection Center) Sargodha</h2>
            <img src={logo} alt="Logo" className="header-logo" />
          </div>

          <form className="donation-form" onSubmit={handleSubmit}>

            <div className="form-body">

              {/* LEFT SIDE  */}
              <div className="left-column">

                <label>Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required />

                <label>Occupation</label>
                <input type="text" name="occupation" value={form.occupation} onChange={handleChange} />

                <label>Donor Type</label>
                <select id="donor" name="donorType" className="input" value={form.donorType} onChange={handleChange}>
                  <option value="Individual">Individual</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Association">Association</option>
                  <option value="Union">Union</option>
                </select>

                <label>Contact No.</label>
                <input type="text" name="contactNo" value={form.contactNo} onChange={handleChange} required />

                <label>Institute\Organization</label>
                <input type="text" name="organization" value={form.organization} onChange={handleChange} />

              </div>

              {/* RIGHT SIDE */}
              <div className="right-column">

                <div className="right-grid">

                  <label>Donation For (Equipment)</label>
                  <select id="donation" name="donationFor" className="input" value={form.donationFor} onChange={handleChange}>
                    <option value="USG Machine Aplio-400 platinum (Refurb)">USG Machine Aplio-400 platinum (Refurb)</option>
                    <option value="X-Ray Machine KXO-50R(Toshiba(Japan) 630MA)">X-Ray Machine KXO-50R(Toshiba(Japan) 630MA)</option>
                    <option value="ECG 3 channel">ECG 3 channel</option>
                    <option value="OPG Verbview(Japan)">OPG Verbview(Japan)</option>
                    <option value="CT Scan 64 slices Toshiba(Japan) with Accessores">CT Scan 64 slices Toshiba(Japan) with Accessores</option>
                    <option value="0.4 Tesla Hitachi MRI (Refurb)">0.4 Tesla Hitachi MRI (Refurb)</option>
                    <option value="ECHO Machine-Paolus Plus(Japan)">ECHO Machine-Paolus Plus(Japan)</option>
                  </select>

                  <label>Donation Type</label>
                  <select id="donationType" name="donationType" className="input" value={form.donationType} onChange={handleChange}>
                    <option value="Cash">Cash</option>
                    <option value="Pledge">Pledge</option>
                  </select>

                  <label>Method/ Mode</label>
                  <select id="method" name="method" className="input" value={form.method} onChange={handleChange}>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Pay Order">Pay Order</option>
                    <option value="Online">Online</option>
                    <option value="Pledge">Pledge</option>
                  </select>

                  <label>Pledge Date (dd/mm/yyyy)</label>
                  <input type="date" name="pledgeDate" className="input" value={form.pledgeDate} onChange={handleChange} />

                  <label>Amount</label>
                  <input type="text" name="amount" value={form.amount} onChange={handleChange} required />

                  <label>Remarks</label>
                  <textarea name="remarks" value={form.remarks} onChange={handleChange}></textarea>

                  <button className="submit-btn" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Submit'}</button>
                </div>

              </div>

            </div>
          </form>
        </div>
      </div>

      {/* Pass fetched data to child components */}
    </>
  )
}

export default DonationForm