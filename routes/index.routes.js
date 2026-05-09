const express = require("express");

const worldBankRoutes = require("./worldbank.routes");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "World Bank API backend funcionando",
  });
});

router.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API operativa",
  });
});

router.use("/api/worldbank", worldBankRoutes);

module.exports = router;
