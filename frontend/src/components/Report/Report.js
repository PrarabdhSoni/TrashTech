import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom'; 
import Loading from '../Loading/loading';
import "./Report.css";
import axios from "axios"
import Select from "react-select";

const Report = () => {
    const [reports, setReports] = useState([]);
    const [bookingId, setBookingId] = useState("");
    const [responseMessage, setResponseMessage] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState([]);
    const { userId } = useParams();
    const navigate = useNavigate();

    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/bookings/${userId}/id`);
        setBookings(response.data.rows || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings.');
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchBookings();
    });
  
    const fetchReports = async () => {
      const response = await axios.get(`http://localhost:4000/reports/${userId}`);
      setReports(response.data.rows || []);
    };
  
    useEffect(() => {
      fetchReports();
    });
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!bookingId || !responseMessage) return;
  
      const response = await axios.post(`http://localhost:4000/reports/${userId}/submit`, {bookingId, responseMessage});
  
      if (response.ok) {
        fetchReports();
        setBookingId("");
        setResponseMessage("");
      }
    };
  
    const markAsSolved = async (reportId) => {
      await axios.patch(`http://localhost:4000/reports/${reportId}/solve`);
      fetchReports();
    };
  
    const toggleDropdown = (index) => {
      setDropdownOpen((prevState) => ({
        ...prevState,
        [index]: !prevState[index],
      }));
    };
  
    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const token = localStorage.getItem('token');
            if (!token) {
              setError('No token found. Please log in.');
              navigate('/login');
              return; 
            }
      
            const response = await axios.get(`http://localhost:4000/home/${userId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            console.log(response)
          } catch (err) {
            if (err.response) {
              if (err.response.status === 403) {
                console.log('Access forbidden: Redirecting to login...');
                navigate('/login');
              } else {
                console.error('An error occurred:', err.response.data);
                setError('An error occurred while fetching user data.');
              }
            } else {
              console.error('An error occurred:', err);
              setError('Network error. Please try again.');
            }
          } finally {
            const TimeoutId = setTimeout(()=>{
              setLoading(false)
            }, 1000)
            return () => clearTimeout(TimeoutId);
          }
        };
        fetchUserData();
      },[userId, navigate]);

      if (loading) return <Loading/>;
      if (error) return <p>Error: {error}</p>;

  return (
    <div className="reports-container">
      <h1 className="reports-heading">Reports</h1>

          <Select
            options={bookings.map((slot) => ({
              value: slot.id,
              label: slot.id,
            }))}
            value={bookingId ? { value: bookingId, label: bookingId.toString() } : null}
            onChange={(selectedOption) => setBookingId(selectedOption ? selectedOption.value : "")}
            placeholder="Select a Booking Id"
            isClearable
          />

      <div className="input-field">
        <label className="sub-heading">Response</label>
        <textarea
          placeholder="Message"
          value={responseMessage}
          onChange={(e) => setResponseMessage(e.target.value)}
        />
      </div>

      <div className="submit-button-container">
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>

      <hr className="separator" />

      <table className="reports-table">
        <thead>
          <tr>
            <th>Report ID</th>
            <th>Date Of Report</th>
            <th>Booking ID</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report, index) => (
            <React.Fragment key={index}>
              <tr
                className={
                  report.status === "In process"
                    ? "report-row in-process"
                    : "report-row solved"
                }
              >
                <td>{report.reportid}</td>
                <td>{new Date(report.created_at).toLocaleString("en-IN", { year: "numeric",month: "numeric",day: "numeric",})}</td>
                <td>{report.bookingid}</td>
                <td>{report.status}</td>
                <td>
                  <button
                    className="dropdown-button"
                    onClick={() => toggleDropdown(index)}
                  >
                  {dropdownOpen[index] ? "Hide Message" : "View Message"}
                  </button>
                  {report.status === "In process" && (
                    <button
                      className="mark-solved-button"
                      onClick={() => markAsSolved(report.reportid)}
                    >
                      Mark as Solved
                    </button>
                  )}
                </td>
              </tr>
              {dropdownOpen[index] && (
                <tr>
                  <td colSpan="5" className="message-row">
                    {report.message}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <hr className="separator" />

      <div className="contact-us">
        <h2 className="sub-heading">Contact Us</h2>
        <p>Phone: +91-8209791150</p>
        <p>Email: support@trashtech.com</p>
      </div>
    </div>
  );
};

export default Report;
