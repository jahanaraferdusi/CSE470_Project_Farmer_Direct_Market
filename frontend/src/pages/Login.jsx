import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  email: "",
  password: "",
};

const Login = () => {
  const [form, setForm] = useState(initialForm);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setForm(initialForm);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = { ...form };
      const res = await API.post("/auth/login", payload);

      setForm(initialForm);
      loginUser(res.data.user, res.data.token);

      if (res.data.user.role === "admin") {
        navigate("/admin/sellers", { replace: true });
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
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <h2>Login</h2>

      <input
        type="email"
        name="email"
        placeholder="Enter email"
        value={form.email}
        onChange={handleChange}
        autoComplete="off"
      />

      <input
        type="password"
        name="password"
        placeholder="Enter password"
        value={form.password}
        onChange={handleChange}
        autoComplete="new-password"
      />

      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
