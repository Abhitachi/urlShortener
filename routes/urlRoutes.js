const express = require("express");
const urlController = require("../controllers/urlControllers");
const { authenticate } = require("../middleware/authMiddleware");
const rateLimiter = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/shorten", authenticate, rateLimiter, urlController.shortenUrl);
router.get("/shorten/:alias", authenticate, urlController.redirectUrl);

module.exports = router;
