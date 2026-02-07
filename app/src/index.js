const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
const ENV = process.env.ENV || "local";

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

app.get("/api/info", (req, res) => {
  res.json({
    service: "enterprise-devops-app",
    version: "1.0.0",
    environment: ENV
  });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT} in ${ENV} environment`);
});
