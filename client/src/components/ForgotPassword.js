import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import styles from './ForgotPassword.module.css';

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await api.post("/forgot-password", { email });
    setMsg(res.data.message);
    if (res.data.success) navigate("/reset-password");
  };

  return (
  <div className={styles.authPage}>
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Forgot Password</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          className={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button type="submit" className={styles.button}>Send OTP</button>
      </form>
      <p className={styles.message}>{msg}</p>
    </div>
  </div>
);

}

export default ForgotPassword;
