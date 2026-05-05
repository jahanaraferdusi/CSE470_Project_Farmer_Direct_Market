import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "customer",
};

const Register = () => {
  const [form, setForm] = useState(initialForm);
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
      await API.post("/auth/register", payload);

      setForm(initialForm);
      alert("Registration successful");
      navigate("/login", { replace: true });
    } catch (error) {
      setForm((prev) => ({ ...prev, password: "" }));
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <h2>Register</h2>

      <input
        type="text"
        name="name"
        placeholder="Enter name"
        value={form.name}
        onChange={handleChange}
        autoComplete="off"
      />

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

      <select name="role" value={form.role} onChange={handleChange}>
        <option value="customer">Customer</option>
        <option value="seller">Seller</option>
      </select>

      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
