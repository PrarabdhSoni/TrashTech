import React, {useEffect, useState} from "react";
import axios from "axios";

const AllEmployees = () =>{
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      // Fetch users from the server
      setLoading(true);
      axios
        .get("http://localhost:4000/api/allEmployee")
        .then((response) => {
          setUsers(response.data);
          setError(null);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
          setError("Failed to fetch users.");
        })
        .finally(() => {
          setLoading(false);
        });
    }, []);
  
    const toggleUserStatus = (userId, currentStatus) => {
      axios
        .put(`http://localhost:4000/api/allEmployee/${userId}`, { is_active: !currentStatus })
        .then((response) => {
          // Use server response to update state
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.employee_id === userId ? { ...user, is_active: response.data.is_active } : user
            )
          );
        })
        .catch((error) => {
          console.error("Error updating user status:", error);
          alert("Failed to update user status.");
        });
    };
  
    if (loading) return <p>Loading users...</p>;
    if (error) return <p>{error}</p>;
  
    return (
      <div>
        <h1>All Employees</h1>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Employee Id</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>First Name</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Last Name</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Email</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Phone Number</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Hire Date</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Job Title</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Salary</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.employee_id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.employee_id}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.first_name}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.last_name}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.email}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.phone_number}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>  {new Date(user.hire_date).toLocaleDateString("en-GB", {day: "2-digit", month: "2-digit", year: "numeric", })}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.job_title}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.salary}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <button
                    type="button"
                    onClick={() => toggleUserStatus(user.employee_id, user.is_active)}
                    style={{
                      backgroundColor: user.is_active ? "#4CAF50" : "#f44336",
                      color: "white",
                      padding: "5px 10px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
}

export default AllEmployees;