const express = require("express");
const cors = require("cors");
const path = require("path");

const indexRoutes = require("../routes/index.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", indexRoutes);
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint no encontrado",
  });
});

module.exports = app;
