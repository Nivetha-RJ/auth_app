// middleware/userAuth.js
import jwt from 'jsonwebtoken';

export const userAuth = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.id) {
      req.user = { id: decoded.id }; // Attach user info to req.user
      next();
    } else {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized: " + error.message });
  }
};
