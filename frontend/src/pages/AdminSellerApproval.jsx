import React, { useEffect, useState } from "react";
import API from "../services/api";

const AdminSellerApproval = () => {
  const [sellers, setSellers] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchPendingSellers = async () => {
    try {
      const res = await API.get("/sellers/pending");
      setSellers(res.data);
    } catch (error) {
      alert("Failed to fetch pending sellers");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (error) {
      alert("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchPendingSellers();
    fetchUsers();
  }, []);

  const handleVerify = async (sellerId) => {
    try {
      await API.put(`/sellers/verify/${sellerId}`);
      alert("Seller verified successfully");
      fetchPendingSellers();
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Verification failed");
    }
  };

  const handleBan = async (userId) => {
    try {
      await API.put(`/users/ban/${userId}`);
      alert("User banned successfully");
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Ban failed");
    }
  };

  const handleUnban = async (userId) => {
    try {
      await API.put(`/users/unban/${userId}`);
      alert("User unbanned successfully");
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Unban failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Pending Seller Requests</h2>

      {sellers.length === 0 ? (
        <p>No pending sellers</p>
      ) : (
        sellers.map((seller) => (
          <div
            key={seller._id}
            style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}
          >
            <p>Name: {seller.name}</p>
            <p>Email: {seller.email}</p>
            <button onClick={() => handleVerify(seller._id)}>Verify Seller</button>
          </div>
        ))
      )}

      <hr style={{ margin: "30px 0" }} />

      <h2>All Users</h2>

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        users.map((user) => (
          <div
            key={user._id}
            style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}
          >
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <p>Status: {user.isBanned ? "Banned" : "Active"}</p>

            {user.role !== "admin" &&
              (user.isBanned ? (
                <button onClick={() => handleUnban(user._id)}>Unban</button>
              ) : (
                <button onClick={() => handleBan(user._id)}>Ban</button>
              ))}
          </div>
        ))
      )}
    </div>
  );
};

export default AdminSellerApproval;
