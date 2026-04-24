import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "customer",
};

const Register = () => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setForm(initialForm);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = { ...form };
      await API.post("/auth/register", payload);

      setForm(initialForm);
      setSuccess("Registration successful. Redirecting to login...");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 900);
    } catch (error) {
      setForm((prev) => ({ ...prev, password: "" }));
      setError(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: "560px" }}>
      <div className="page-header">
        <h1 className="page-title">Create Account</h1>
        <p className="page-subtitle">
          Join as a customer or seller in the Farmer Direct Market.
        </p>
      </div>

      {error && <div className="error-box">{error}</div>}
      {success && <div className="success-box">{success}</div>}

      <form className="page-card" onSubmit={handleSubmit} autoComplete="off">
        <h2 className="card-title">Register</h2>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              type="text"
              name="name"
              placeholder="Enter name"
              value={form.name}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Account Type</label>
            <select
              className="form-select"
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </div>

        <p style={{ marginTop: "18px", color: "#607064" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#2e7d32", fontWeight: "800" }}>
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;