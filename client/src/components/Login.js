import React, { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import styles from './Login.module.css';

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post("/login", form);
      setMsg(res.data.message);
      if (res.data.success) navigate("/dashboard");
    } catch (err) {
      setMsg("Login failed");
    }
  };

  return (
  <div className={styles.loginPage}>
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Welcome Back</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          className={styles.input}
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className={styles.input}
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className={styles.button}>Login</button>
      </form>
      <p className={styles.message}>{msg}</p>
      <Link to="/forgot-password" className={styles.link}>Forgot Password?</Link>
      <Link to="/register" className={styles.linkSecondary}>Don't have an account? Register</Link>
    </div>
  </div>
);


}

export default Login;
