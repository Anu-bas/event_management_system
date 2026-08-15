const { asyncHandler } = require("../middleware/auth");
const Event = require("../models/Event");
const Registration = require("../models/Registration");

// @desc Get organizer dashboard stats
// @route GET /api/organizer/stats
// @access Private (organizer)
const getOrganizerStats = asyncHandler(async (req, res) => {
  const events = await Event.find({ organizer: req.user._id });
  const eventIds = events.map((e) => e._id);
  const registrations = await Registration.find({ event: { $in: eventIds } });

  const totalRegistrations = registrations.filter((r) => r.status !== "cancelled").length;
  const totalRevenue = await Promise.all(
    events.map(async (e) => {
      const count = registrations.filter((r) => String(r.event) === String(e._id) && r.status !== "cancelled").length;
      return e.price * count;
    })
  );

  res.json({
    totalEvents: events.length,
    openEvents: events.filter((e) => e.status === "open").length,
    draftEvents: events.filter((e) => e.status === "draft").length,
    totalRegistrations,
    totalRevenue: totalRevenue.reduce((a, b) => a + b, 0),
  });
});

// @desc Get events created by the logged-in organizer
// @route GET /api/organizer/events
// @access Private (organizer)
const getMyEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ organizer: req.user._id }).sort({ createdAt: -1 });
  const eventIds = events.map((e) => e._id);
  const counts = await Registration.aggregate([
    { $match: { event: { $in: eventIds }, status: { $ne: "cancelled" } } },
    { $group: { _id: "$event", count: { $sum: 1 } } },
  ]);
  const countMap = {};
  counts.forEach((c) => (countMap[c._id.toString()] = c.count));
  const withCounts = events.map((e) => ({ ...e.toJSON(), registeredCount: countMap[e._id.toString()] || 0 }));
  res.json(withCounts);
});

module.exports = { getOrganizerStats, getMyEvents };
