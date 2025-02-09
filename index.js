const express = require("express");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");
const urlRoutes = require("./routes/urlRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const analyticsRoutes = require("./routes/analyticsRoutes");
const { authenticate } = require("./middleware/authMiddleware");
const requestIp = require("request-ip");
require("./config/passport");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(requestIp.mw());
app.use("/api/auth", authRoutes);
app.use("/api/url", urlRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  console.log(req.userId, "userID");
  if (req.userId) {
    res.status(200).json({ message: `Welcome to Landing Page ${req.user}, ` });
  } else {
    res.send('<a href="api/auth/google">Authenticate with Google </a>');
  }
  // res.status(200).json({ message: `Hello User` });
});

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "URL SHORTENER",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [
      { url: "http://localhost:3000" },
      { url: "https://dummyurlshortener.duckdns.org/" },
    ],
  },
  apis: ["./swagger.yml"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
