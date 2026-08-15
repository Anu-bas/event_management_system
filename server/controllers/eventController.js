const { asyncHandler } = require("../middleware/auth");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const ActivityLog = require("../models/ActivityLog");

// @desc Get all publicly visible events (open/closed), with optional category filter
// @route GET /api/events
// @access Public
const getEvents = asyncHandler(async (req, res) => {
  const { category, status } = req.query;
  const filter = {};
  // Public listing excludes drafts unless requester is the organizer/admin (handled in organizer/admin routes)
  filter.status = status ? status : { $in: ["open", "closed"] };
  if (category && category !== "all") filter.category = category;

  const events = await Event.find(filter).populate("organizer", "name email").sort({ date: 1 });
  const withCounts = await attachRegistrationCounts(events);
  res.json(withCounts);
});

// @desc Get single event by id
// @route GET /api/events/:id
// @access Public
const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate("organizer", "name email");
  if (!event) return res.status(404).json({ message: "Event not found" });
  const [withCount] = await attachRegistrationCounts([event]);
  res.json(withCount);
});

// @desc Create an event (organizer/admin)
// @route POST /api/events
// @access Private (organizer, admin)
const createEvent = asyncHandler(async (req, res) => {
  const { title, category, date, time, venue, capacity, status, price, color, desc, tags } = req.body;
  if (!title || !category || !date || !time || !venue || !capacity) {
    return res.status(400).json({ message: "Missing required event fields" });
  }
  const event = await Event.create({
    title,
    category,
    date,
    time,
    venue,
    capacity,
    status: status || "draft",
    price: price || 0,
    color: color || "blue",
    desc: desc || "",
    tags: tags || [],
    organizer: req.user._id,
  });
  await ActivityLog.create({ actor: req.user.name, action: "Created event", target: event.title });
  res.status(201).json(event);
});

// @desc Update an event (organizer who owns it, or admin)
// @route PUT /api/events/:id
// @access Private (organizer, admin)
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });

  if (req.user.role === "organizer" && String(event.organizer) !== String(req.user._id)) {
    return res.status(403).json({ message: "You can only edit your own events" });
  }

  const fields = ["title", "category", "date", "time", "venue", "capacity", "status", "price", "color", "desc", "tags"];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) event[f] = req.body[f];
  });

  await event.save();
  await ActivityLog.create({ actor: req.user.name, action: "Updated event", target: event.title });
  res.json(event);
});

// @desc Delete an event (owner organizer or admin)
// @route DELETE /api/events/:id
// @access Private (organizer, admin)
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });

  if (req.user.role === "organizer" && String(event.organizer) !== String(req.user._id)) {
    return res.status(403).json({ message: "You can only delete your own events" });
  }

  await Registration.deleteMany({ event: event._id });
  await event.deleteOne();
  await ActivityLog.create({ actor: req.user.name, action: "Removed event", target: event.title });
  res.json({ message: "Event removed" });
});

// Helper: attach registration counts to a list of events
async function attachRegistrationCounts(events) {
  const eventIds = events.map((e) => e._id);
  const counts = await Registration.aggregate([
    { $match: { event: { $in: eventIds }, status: { $ne: "cancelled" } } },
    { $group: { _id: "$event", count: { $sum: 1 } } },
  ]);
  const countMap = {};
  counts.forEach((c) => (countMap[c._id.toString()] = c.count));
  return events.map((e) => {
    const obj = e.toJSON ? e.toJSON() : e;
    obj.registeredCount = countMap[e._id.toString()] || 0;
    return obj;
  });
}

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };
