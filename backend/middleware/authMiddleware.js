// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();


const pool = require("../config/db");

// const verifyTeacherToken = async (req, res, next) => {
//   const token = req.header("Authorization")?.replace("Bearer ", "");

//   if (!token) return res.status(401).json({ message: "Access denied: No token provided" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [decoded.id]);

//     if (rows.length === 0)
//       return res.status(401).json({ message: "Invalid token: User not found" });

//     req.user = rows[0]; // attach user info to request
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Invalid or expired token" });
//   }
// };

// module.exports = verifyTeacherToken;



module.exports = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Access denied: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [rows] = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = rows[0]; // important
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
