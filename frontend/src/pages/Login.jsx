import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  email: "",
  password: "",
};

const Login = () => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setForm(initialForm);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = { ...form };
      const res = await API.post("/auth/login", payload);

      setForm(initialForm);
      loginUser(res.data.user, res.data.token);

      if (res.data.user.role === "admin") {
        navigate("/admin/seller-approval", { replace: true });
      } else if (res.data.user.role === "seller") {
        const alertRes = await API.get("/products/seller/spoilage-alerts");

        if (alertRes.data.hasSpoilageAlert) {
          alert("You have stock spoilage alerts. Redirecting now.");
          navigate("/seller/spoilage-alerts", { replace: true });
        } else {
          navigate("/seller/add-product", { replace: true });
        }
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      setForm((prev) => ({ ...prev, password: "" }));
      setError(error.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: "520px" }}>
      <div className="page-header">
        <h1 className="page-title">Welcome Back</h1>
        <p className="page-subtitle">
          Login to continue shopping fresh farm products.
        </p>
      </div>

      {error && <div className="error-box">{error}</div>}

      <form className="page-card" onSubmit={handleSubmit} autoComplete="off">
        <h2 className="card-title">Login</h2>

        <div className="form-grid">
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

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <p style={{ marginTop: "18px", color: "#607064" }}>
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            style={{ color: "#2e7d32", fontWeight: "800" }}
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;