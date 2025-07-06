import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config(); // 🟡 Required to access `.env` variables in this file

const getTransporter = () => {
  console.log("SMTP_USER inside nodemailer:", process.env.SMTP_USER); // ✅ Will print

  return nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });
};

export default getTransporter;
