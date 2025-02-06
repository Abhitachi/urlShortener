const passport = require("passport");
const jwt = require("jsonwebtoken");

exports.googleAuth = passport.authenticate("google", {
  scope: ["email", "profile"],
});

exports.googleAuthCallback = (req, res) => {
  try {
    const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Authentication failed" });
  }
};
