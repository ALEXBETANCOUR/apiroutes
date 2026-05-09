const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const indexRoutes = require("./routes/index.routes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", indexRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "World Bank API backend funcionando",
  });
});

module.exports = app;
