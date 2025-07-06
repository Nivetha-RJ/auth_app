import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import styles from './Register.module.css';

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post("/register", form);
      setMsg(res.data.message);
      if (res.data.success) navigate("/login");
    } catch (err) {
      setMsg("Registration failed");
    }
  };

  return (
  <div className={styles.authPage}>
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Register</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          className={styles.input}
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
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
        <button type="submit" className={styles.button}>Register</button>
      </form>
      <p className={styles.message}>{msg}</p>
    </div>
  </div>
);


}

export default Register;
