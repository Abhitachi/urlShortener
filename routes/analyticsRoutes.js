const express = require("express");
const analyticsController = require("../controllers/analyticsController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:shortUrl", authenticate, analyticsController.getUrlAnalytics);
router.get(
  "/topic/:topic",
  authenticate,
  analyticsController.getTopicAnalytics
);
router.get(
  "/overall/:id",
  authenticate,
  analyticsController.getOverAllAnalytics
);

module.exports = router;
