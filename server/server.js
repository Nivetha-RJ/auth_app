import dotenv from "dotenv";
dotenv.config(); // 🟢 Load .env variables FIRST

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

// Connect to DB
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));

// Routes
app.get('/', (req, res) => {
  res.send("API working");
});

app.use('/api/auth', authRouter);

// Start server
app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
