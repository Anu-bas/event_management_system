const express = require("express");
const router = express.Router();
const {
  getAdminStats,
  getUsers,
  setUserStatus,
  getPendingOrganizers,
  getOrganizers,
  approveOrganizer,
  rejectOrganizer,
  getAllEvents,
  getAllRegistrations,
  getReports,
  getLogs,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect, authorize("admin"));

router.get("/stats", getAdminStats);
router.get("/users", getUsers);
router.put("/users/:id/status", setUserStatus);
router.get("/organizers/pending", getPendingOrganizers);
router.get("/organizers", getOrganizers);
router.put("/organizers/:id/approve", approveOrganizer);
router.put("/organizers/:id/reject", rejectOrganizer);
router.get("/events", getAllEvents);
router.get("/registrations", getAllRegistrations);
router.get("/reports", getReports);
router.get("/logs", getLogs);

module.exports = router;
