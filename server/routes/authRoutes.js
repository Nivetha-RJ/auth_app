import express from 'express';
import { login, logout, register, sendVerificationOTP, verifyEmail, sendForgotPasswordOtp, resetPasswordWithOtp } from '../controllers/authController.js';
import { userAuth } from '../middleware/userAuth.js';

const authRouter=express.Router();

authRouter.post('/register', register);

authRouter.post('/login', login);

authRouter.post('/logout', logout);

authRouter.post('/send-verify-otp', userAuth, sendVerificationOTP);

authRouter.post('/verify-account', userAuth, verifyEmail);

authRouter.post('/forgot-password', sendForgotPasswordOtp);

authRouter.post('/reset-password', resetPasswordWithOtp);

export default authRouter; 