import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const SellerPolls = () => {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [polls, setPolls] = useState([]);
  const [form, setForm] = useState({
    productId: "",
    question: "",
  });
  const [message, setMessage] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await API.get(`/products/seller/${user._id || user.id}`);
      setProducts(res.data);
    } catch (error) {
      setMessage("Failed to load products.");
    }
  };

  const fetchPolls = async () => {
    try {
      const res = await API.get("/polls/seller/my-polls");
      setPolls(res.data);
    } catch (error) {
      setMessage("Failed to load polls.");
    }
  };

  useEffect(() => {
    if (user) {
      fetchProducts();
      fetchPolls();
    }
  }, [user]);

  const createPoll = async (e) => {
    e.preventDefault();

    try {
      await API.post("/polls", form);
      setMessage("Poll created successfully.");
      setForm({
        productId: "",
        question: "",
      });
      fetchPolls();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create poll.");
    }
  };

  const resetPoll = async (pollId) => {
    try {
      await API.put(`/polls/${pollId}/reset`);
      setMessage("Poll reset successfully.");
      fetchPolls();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to reset poll.");
    }
  };

  const updatePoll = async (pollId, oldQuestion) => {
    const newQuestion = window.prompt("Enter updated poll question:", oldQuestion);

    if (!newQuestion) return;

    try {
      await API.put(`/polls/${pollId}`, {
        question: newQuestion,
      });
      setMessage("Poll updated successfully.");
      fetchPolls();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update poll.");
    }
  };

  const deletePoll = async (pollId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this poll?");

    if (!confirmDelete) return;

    try {
      await API.delete(`/polls/${pollId}`);
      setMessage("Poll deleted successfully.");
      fetchPolls();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to delete poll.");
    }
  };

  const getStatus = (poll) => {
    if (!poll.isActive || new Date(poll.endsAt) <= new Date()) {
      return "Ended";
    }

    return "Active";
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Product Polls</h1>
        <p className="page-subtitle">
          Create polls to understand customer demand for your products.
        </p>
      </div>

      {message && <div className="info-box">{message}</div>}

      <form className="page-card" onSubmit={createPoll}>
        <h2 className="card-title">Create New Poll</h2>

        <div className="form-group">
          <label className="form-label">Select Product</label>
          <select
            className="form-select"
            value={form.productId}
            onChange={(e) => setForm({ ...form, productId: e.target.value })}
            required
          >
            <option value="">Choose a product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name} - {product.category}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Poll Question</label>
          <input
            className="form-input"
            type="text"
            placeholder="Example: Do you want more fresh tomatoes this week?"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            required
          />
        </div>

        <button className="primary-btn" type="submit">
          Create Poll
        </button>
      </form>

      <div className="page-card" style={{ marginTop: "20px" }}>
        <h2 className="card-title">My Polls</h2>

        {polls.length === 0 ? (
          <div className="empty-state">No polls created yet.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Product</th>
                <th style={thStyle}>Question</th>
                <th style={thStyle}>Votes</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Ends At</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {polls.map((poll) => (
                <tr key={poll._id}>
                  <td style={tdStyle}>{poll.product?.name}</td>
                  <td style={tdStyle}>{poll.question}</td>
                  <td style={tdStyle}>{poll.totalVotes}</td>
                  <td style={tdStyle}>{getStatus(poll)}</td>
                  <td style={tdStyle}>
                    {new Date(poll.endsAt).toLocaleString()}
                  </td>
                  <td style={tdStyle}>
                    <button
                      className="secondary-btn"
                      onClick={() => updatePoll(poll._id, poll.question)}
                    >
                      Update
                    </button>{" "}
                    <button
                      className="secondary-btn"
                      onClick={() => resetPoll(poll._id)}
                    >
                      Reset
                    </button>{" "}
                    <button
                      className="danger-btn"
                      onClick={() => deletePoll(poll._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const thStyle = {
  textAlign: "left",
  padding: "12px",
  borderBottom: "2px solid #d7e8d0",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #e5e5e5",
};

export default SellerPolls;