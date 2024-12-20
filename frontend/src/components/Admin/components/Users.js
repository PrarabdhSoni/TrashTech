import React, { useEffect, useState } from "react";
import axios from "axios";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch users from the server
    setLoading(true);
    axios
      .get("http://localhost:4000/api/users")
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
      .put(`http://localhost:4000/api/users/${userId}`, { is_active: !currentStatus })
      .then((response) => {
        // Use server response to update state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, is_active: response.data.is_active } : user
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
      <h1>Manage Users</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>User Id</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Email</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.id}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.email}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <button
                  type="button"
                  onClick={() => toggleUserStatus(user.id, user.is_active)}
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

export default Users;
