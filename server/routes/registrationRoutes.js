const express = require("express");
const router = express.Router();
const {
  createRegistration,
  getMyRegistrations,
  cancelRegistration,
  getEventRegistrations,
  toggleCheckIn,
} = require("../controllers/registrationController");
const { protect, authorize } = require("../middleware/auth");

router.post("/", protect, createRegistration);
router.get("/mine", protect, getMyRegistrations);
router.put("/:id/cancel", protect, cancelRegistration);
router.get("/event/:eventId", protect, authorize("organizer", "admin"), getEventRegistrations);
router.put("/:id/checkin", protect, authorize("organizer", "admin"), toggleCheckIn);

module.exports = router;
