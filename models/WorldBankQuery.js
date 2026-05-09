const mongoose = require("mongoose");

const worldBankQuerySchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    indicator: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    indicatorName: {
      type: String,
      trim: true,
      default: "",
    },
    countryName: {
      type: String,
      trim: true,
      default: "",
    },
    year: {
      type: String,
      default: "",
    },
    value: {
      type: Number,
      default: null,
    },
    source: {
      type: String,
      default: "World Bank API",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    rawData: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("WorldBankQuery", worldBankQuerySchema);
