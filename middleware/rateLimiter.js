const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
  windowsMS: 15 * 60 * 1000,
  max: 100,
  message: "Too many Requests, Please try agian later",
});

module.exports = rateLimiter;
