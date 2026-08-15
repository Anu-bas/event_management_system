const express = require("express");
const router = express.Router();
const { getOrganizerStats, getMyEvents } = require("../controllers/organizerController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect, authorize("organizer"));
router.get("/stats", getOrganizerStats);
router.get("/events", getMyEvents);

module.exports = router;
