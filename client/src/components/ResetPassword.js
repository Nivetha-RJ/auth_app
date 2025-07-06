import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import styles from './ResetPassword.module.css';

function ResetPassword() {
  const [form, setForm] = useState({ email: "", otp: "", newPassword: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await api.post("/reset-password", form);
    setMsg(res.data.message);
    if (res.data.success) navigate("/login");
  };

  return (
  <div className={styles.authPage}>
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Reset Password</h2>
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
          name="otp"
          placeholder="OTP"
          value={form.otp}
          onChange={handleChange}
          required
        />
        <input
          className={styles.input}
          name="newPassword"
          type="password"
          placeholder="New Password"
          value={form.newPassword}
          onChange={handleChange}
          required
        />
        <button type="submit" className={styles.button}>Reset Password</button>
      </form>
      <p className={styles.message}>{msg}</p>
    </div>
  </div>
);

}

export default ResetPassword;
