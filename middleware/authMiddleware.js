const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

exports.authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findUserById(decoded.userId);
    console.log(decoded, "decoded", user, "user");
    req.user = user;
    next();
  } catch (err) {
    console.log(err, "error");
    res.status(401).json({ message: "Invalid token" });
  }
};
