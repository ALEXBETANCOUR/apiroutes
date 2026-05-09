const express = require("express");

const {
  searchWorldBank,
  getSavedQueries,
  getSavedQueryById,
  createSavedQuery,
  updateSavedQuery,
  deleteSavedQuery,
} = require("../controllers/worldbank.controller");

const router = express.Router();

router.get("/search", searchWorldBank);
router.get("/saved", getSavedQueries);
router.get("/saved/:id", getSavedQueryById);
router.post("/saved", createSavedQuery);
router.put("/saved/:id", updateSavedQuery);
router.delete("/saved/:id", deleteSavedQuery);

module.exports = router;
