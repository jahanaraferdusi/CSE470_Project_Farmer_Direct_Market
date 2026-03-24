import React, { useEffect, useState } from "react";;
import API from "../services/api";

const AdminSellerApproval = () => {
  const [sellers, setSellers] = useState([]);

  const fetchPendingSellers = async () => {
    try {
      const res = await API.get("/sellers/pending");
      setSellers(res.data);
    } catch (error) {
      alert("Failed to fetch pending sellers");
    }
  };

  useEffect(() => {
    fetchPendingSellers();
  }, []);

  const handleVerify = async (sellerId) => {
    try {
      await API.put(`/sellers/verify/${sellerId}`);
      alert("Seller verified successfully");
      fetchPendingSellers();
    } catch (error) {
      alert(error.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div>
      <h2>Pending Seller Requests</h2>

      {sellers.length === 0 ? (
        <p>No pending sellers</p>
      ) : (
        sellers.map((seller) => (
          <div
            key={seller._id}
            style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}
          >
            <p>Name: {seller.name}</p>
            <p>Email: {seller.email}</p>
            <button onClick={() => handleVerify(seller._id)}>Verify Seller</button>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminSellerApproval;