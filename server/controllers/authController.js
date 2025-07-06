// controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModels.js';
import getTransporter from '../config/nodemailer.js';

// REGISTER
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: 'Missing Details' });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: 'User already exists' });
    }

    const hashedpw = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedpw });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send welcome email
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'WELCOME TO AUTH APP',
      text: "WELCOME TO AUTH APP. YOU HAVE CREATED YOUR ACCOUNT SUCCESSFULLY ✅"
    };
    const transporter = getTransporter();
    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "User registered successfully" });

  } catch (error) {
    console.error("Register error:", error);
    return res.json({ success: false, message: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: 'Empty fields' });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User does not exist' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: "Login successful" });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    return res.json({ success: true, message: "Logged out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// SEND VERIFICATION OTP
export const sendVerificationOTP = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    const userID = req.user.id;
    const user = await userModel.findById(userID);
    if (!user) return res.json({ success: false, message: "User not found" });

    if (user.isAccountVerified)
      return res.json({ success: true, message: "ALREADY VERIFIED" });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: user.email,
      subject: 'ACCOUNT VERIFICATION OTP',
      html: `<p>Your verification OTP is: <b>${otp}</b></p>`
    };

    const transporter = getTransporter();
    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "OTP sent" });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// VERIFY EMAIL
export const verifyEmail = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  const userID = req.user.id;
  const { otp } = req.body;

  if (!otp) {
    return res.json({ success: false, message: "Missing OTP" });
  }

  try {
    const user = await userModel.findById(userID);
    if (!user) return res.json({ success: false, message: 'User not found' });

    if (!user.verifyOtp || user.verifyOtp !== otp)
      return res.json({ success: false, message: "Invalid OTP" });

    if (user.verifyOtpExpireAt < Date.now())
      return res.json({ success: false, message: "OTP expired" });

    user.isAccountVerified = true;
    user.verifyOtp = '';
    user.verifyOtpExpireAt = 0;
    await user.save();

    return res.json({ success: true, message: "Email verified" });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
export const sendForgotPasswordOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.json({ success: false, message: "Email is required" });

  const user = await userModel.findOne({ email });
  if (!user) return res.json({ success: false, message: "User not found" });

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  user.resetOtp = otp;
  user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save();

  // Send OTP email
  const transporter = getTransporter();
  await transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to: user.email,
    subject: 'Password Reset OTP',
    html: `<p>Your password reset OTP is: <b>${otp}</b></p>`
  });

  return res.json({ success: true, message: "Password reset OTP sent to your email." });
};
export const resetPasswordWithOtp = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword)
    return res.json({ success: false, message: "All fields are required" });

  const user = await userModel.findOne({ email });
  if (!user) return res.json({ success: false, message: "User not found" });

  if (
    !user.resetOtp ||
    user.resetOtp !== otp ||
    user.resetOtpExpireAt < Date.now()
  ) {
    return res.json({ success: false, message: "Invalid or expired OTP" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetOtp = '';
  user.resetOtpExpireAt = 0;
  await user.save();

  return res.json({ success: true, message: "Password reset successful" });
};
