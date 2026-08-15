const { asyncHandler } = require("../middleware/auth");
const User = require("../models/User");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const OrganizerApplication = require("../models/OrganizerApplication");
const ActivityLog = require("../models/ActivityLog");

// @desc Platform-wide dashboard stats
// @route GET /api/admin/stats
// @access Private (admin)
const getAdminStats = asyncHandler(async (req, res) => {
  const [userCount, eventCount, registrationCount, pendingOrganizers] = await Promise.all([
    User.countDocuments(),
    Event.countDocuments(),
    Registration.countDocuments({ status: { $ne: "cancelled" } }),
    OrganizerApplication.countDocuments({ status: "pending" }),
  ]);
  res.json({
    userCount,
    eventCount,
    registrationCount,
    pendingOrganizers,
    organizerCount: await User.countDocuments({ role: "organizer" }),
    participantCount: await User.countDocuments({ role: "participant" }),
  });
});

// @desc List all users
// @route GET /api/admin/users
// @access Private (admin)
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
});

// @desc Suspend / reactivate a user
// @route PUT /api/admin/users/:id/status
// @access Private (admin)
const setUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // "active" | "suspended"
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.status = status;
  await user.save();
  await ActivityLog.create({
    actor: req.user.name,
    action: status === "suspended" ? "Suspended user" : "Reactivated user",
    target: user.email,
  });
  res.json(user);
});

// @desc List pending organizer applications
// @route GET /api/admin/organizers/pending
// @access Private (admin)
const getPendingOrganizers = asyncHandler(async (req, res) => {
  const pending = await OrganizerApplication.find({ status: "pending" }).sort({ createdAt: -1 });
  res.json(pending);
});

// @desc List all active organizers
// @route GET /api/admin/organizers
// @access Private (admin)
const getOrganizers = asyncHandler(async (req, res) => {
  const organizers = await User.find({ role: "organizer" }).sort({ createdAt: -1 });
  const withCounts = await Promise.all(
    organizers.map(async (o) => {
      const eventCount = await Event.countDocuments({ organizer: o._id });
      return { ...o.toObject(), eventCount };
    })
  );
  res.json(withCounts);
});

// @desc Approve a pending organizer application -> creates a User with role organizer
// @route PUT /api/admin/organizers/:id/approve
// @access Private (admin)
const approveOrganizer = asyncHandler(async (req, res) => {
  const application = await OrganizerApplication.findById(req.params.id).select("+password");
  if (!application) return res.status(404).json({ message: "Application not found" });

  const existingUser = await User.findOne({ email: application.email });
  if (existingUser) {
    return res.status(400).json({ message: "A user with this email already exists" });
  }

  // Insert directly via the collection since the application password is already
  // bcrypt-hashed, and User's pre-save hook would otherwise hash it a second time.
  await User.collection.insertOne({
    name: application.name,
    email: application.email,
    password: application.password,
    role: "organizer",
    status: "active",
    organization: application.org,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  application.status = "approved";
  await application.save();

  await ActivityLog.create({ actor: req.user.name, action: "Approved organizer account", target: application.name });
  res.json({ message: "Organizer approved", email: application.email });
});

// @desc Reject a pending organizer application
// @route PUT /api/admin/organizers/:id/reject
// @access Private (admin)
const rejectOrganizer = asyncHandler(async (req, res) => {
  const application = await OrganizerApplication.findById(req.params.id);
  if (!application) return res.status(404).json({ message: "Application not found" });
  application.status = "rejected";
  await application.save();
  await ActivityLog.create({ actor: req.user.name, action: "Rejected organizer application", target: application.name });
  res.json({ message: "Application rejected" });
});

// @desc List all events (admin overview)
// @route GET /api/admin/events
// @access Private (admin)
const getAllEvents = asyncHandler(async (req, res) => {
  const events = await Event.find().populate("organizer", "name email").sort({ createdAt: -1 });
  const eventIds = events.map((e) => e._id);
  const counts = await Registration.aggregate([
    { $match: { event: { $in: eventIds }, status: { $ne: "cancelled" } } },
    { $group: { _id: "$event", count: { $sum: 1 } } },
  ]);
  const countMap = {};
  counts.forEach((c) => (countMap[c._id.toString()] = c.count));
  res.json(events.map((e) => ({ ...e.toJSON(), registeredCount: countMap[e._id.toString()] || 0 })));
});

// @desc List all registrations (admin overview)
// @route GET /api/admin/registrations
// @access Private (admin)
const getAllRegistrations = asyncHandler(async (req, res) => {
  const registrations = await Registration.find()
    .populate("user", "name email")
    .populate("event", "title")
    .sort({ createdAt: -1 });
  res.json(registrations);
});

// @desc Platform-wide reports (revenue, fill rate, category breakdown)
// @route GET /api/admin/reports
// @access Private (admin)
const getReports = asyncHandler(async (req, res) => {
  const events = await Event.find();
  const registrations = await Registration.find();

  let totalRevenue = 0;
  events.forEach((e) => {
    const paidCount = registrations.filter(
      (r) => String(r.event) === String(e._id) && r.status !== "cancelled"
    ).length;
    totalRevenue += e.price * paidCount;
  });

  const totalCapacity = events.reduce((s, e) => s + e.capacity, 0);
  const avgFillRate = totalCapacity ? Math.round((registrations.length / totalCapacity) * 100) : 0;
  const organizerCount = await User.countDocuments({ role: "organizer" });
  const cancelledCount = registrations.filter((r) => r.status === "cancelled").length;

  const byCategory = {};
  for (const e of events) {
    const count = registrations.filter(
      (r) => String(r.event) === String(e._id) && r.status !== "cancelled"
    ).length;
    byCategory[e.category] = (byCategory[e.category] || 0) + count;
  }

  res.json({
    totalRevenue,
    avgFillRate,
    organizerCount,
    cancelledCount,
    totalRegistrations: registrations.length,
    byCategory,
  });
});

// @desc Get platform activity logs
// @route GET /api/admin/logs
// @access Private (admin)
const getLogs = asyncHandler(async (req, res) => {
  const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(200);
  res.json(logs);
});

module.exports = {
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
};
