import React, { useEffect, useState } from "react";
import API from "../services/api";

const AdminSellerApproval = () => {
  const [sellers, setSellers] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [loadingSellers, setLoadingSellers] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const fetchPendingSellers = async () => {
    try {
      setLoadingSellers(true);
      setMessage("");

      const res = await API.get("/sellers/pending");
      setSellers(res.data);
    } catch (error) {
      setMessage("Failed to fetch pending sellers.");
    } finally {
      setLoadingSellers(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      setMessage("");

      const res = await API.get("/users");
      setUsers(res.data);
    } catch (error) {
      setMessage("Failed to fetch users.");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchPendingSellers();
    fetchUsers();
  }, []);

  const handleVerify = async (sellerId) => {
    try {
      setMessage("");

      await API.put(`/sellers/verify/${sellerId}`);

      setMessage("Seller verified successfully.");
      fetchPendingSellers();
      fetchUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || "Verification failed.");
    }
  };

  const handleBan = async (userId) => {
    try {
      setMessage("");

      await API.put(`/users/ban/${userId}`);

      setMessage("User banned successfully.");
      fetchUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || "Ban failed.");
    }
  };

  const handleUnban = async (userId) => {
    try {
      setMessage("");

      await API.put(`/users/unban/${userId}`);

      setMessage("User unbanned successfully.");
      fetchUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unban failed.");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">
          Review seller requests and manage user account status.
        </p>
      </div>

      {message && (
        <div
          className={
            message.toLowerCase().includes("successfully")
              ? "success-box"
              : "error-box"
          }
        >
          {message}
        </div>
      )}

      <div className="page-card">
        <h2 className="card-title">Pending Seller Requests</h2>

        {loadingSellers ? (
          <div className="empty-state">Loading pending sellers...</div>
        ) : sellers.length === 0 ? (
          <div className="empty-state">No pending sellers.</div>
        ) : (
          <div className="card-grid">
            {sellers.map((seller) => (
              <div key={seller._id} className="pretty-card">
                <h3 style={{ color: "#245c2f", marginTop: 0 }}>
                  {seller.name}
                </h3>

                <p>
                  <strong>Email:</strong> {seller.email}
                </p>
                <p>
                  <strong>Role:</strong> {seller.role}
                </p>

                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => handleVerify(seller._id)}
                  style={{ width: "100%", marginTop: "10px" }}
                >
                  Verify Seller
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="page-card">
        <h2 className="card-title">All Users</h2>

        {loadingUsers ? (
          <div className="empty-state">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="empty-state">No users found.</div>
        ) : (
          <div className="table-wrapper">
            <table className="pretty-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <span
                        style={{
                          color: user.isBanned ? "#c62828" : "#2e7d32",
                          fontWeight: "800",
                        }}
                      >
                        {user.isBanned ? "Banned" : "Active"}
                      </span>
                    </td>
                    <td>
                      {user.role === "admin" ? (
                        <span style={{ color: "#607064" }}>No action</span>
                      ) : user.isBanned ? (
                        <button
                          type="button"
                          className="secondary-btn"
                          onClick={() => handleUnban(user._id)}
                        >
                          Unban
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="danger-btn"
                          onClick={() => handleBan(user._id)}
                        >
                          Ban
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSellerApproval;