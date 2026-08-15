const { asyncHandler } = require("../middleware/auth");
const Registration = require("../models/Registration");
const Event = require("../models/Event");
const Notification = require("../models/Notification");
const generateCode = require("../utils/generateCode");

// @desc Register the logged-in participant for an event
// @route POST /api/registrations
// @access Private (participant)
const createRegistration = asyncHandler(async (req, res) => {
  const { eventId } = req.body;

  if (req.user.role !== "participant") {
    return res
      .status(403)
      .json({ message: "Only participant accounts can register for events" });
  }

  const event = await Event.findById(eventId);

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  if (event.status !== "open") {
    return res.status(400).json({
      message:
        event.status === "draft"
          ? "Registration is not yet open for this event"
          : "Registration is closed for this event",
    });
  }

  // Prevent duplicate registration
  const existing = await Registration.findOne({
    event: event._id,
    user: req.user._id,
    status: { $ne: "cancelled" },
  });

  if (existing) {
    return res
      .status(400)
      .json({ message: "You are already registered for this event" });
  }

  // Check capacity
  const activeCount = await Registration.countDocuments({
    event: event._id,
    status: { $ne: "cancelled" },
  });

  if (activeCount >= event.capacity) {
    return res
      .status(400)
      .json({ message: "This event is at full capacity" });
  }

  // Create registration
  const registration = await Registration.create({
    event: event._id,
    user: req.user._id,
    status: "pending",
    checkedIn: false,
    code: generateCode(event.title),
  });

  // Notification
  await Notification.create({
    user: req.user._id,
    text: `Your registration for "${event.title}" is pending.`,
  });

  res.status(201).json(registration);
});

// @desc Get logged-in user's registrations
// @route GET /api/registrations/mine
// @access Private
const getMyRegistrations = asyncHandler(async (req, res) => {
  const registrations = await Registration.find({
    user: req.user._id,
  })
    .populate("event")
    .sort({ createdAt: -1 });

  res.json(registrations);
});

// @desc Cancel registration
// @route PUT /api/registrations/:id/cancel
// @access Private
const cancelRegistration = asyncHandler(async (req, res) => {
  const registration = await Registration.findById(req.params.id).populate(
    "event"
  );

  if (!registration) {
    return res.status(404).json({
      message: "Registration not found",
    });
  }

  if (String(registration.user) !== String(req.user._id)) {
    return res.status(403).json({
      message: "You can only cancel your own registration",
    });
  }

  await Registration.findByIdAndDelete(req.params.id);

  await Notification.create({
    user: req.user._id,
    text: `Your registration for "${registration.event.title}" was cancelled.`,
  });

  res.json({
    message: "Registration cancelled successfully",
  });
});

// @desc Get registrations for an event
// @route GET /api/registrations/event/:eventId
// @access Private (Organizer/Admin)
const getEventRegistrations = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.eventId);

  if (!event) {
    return res.status(404).json({
      message: "Event not found",
    });
  }

  if (
    req.user.role === "organizer" &&
    String(event.organizer) !== String(req.user._id)
  ) {
    return res.status(403).json({
      message: "You can only view registrations for your own events",
    });
  }

  const registrations = await Registration.find({
    event: event._id,
  })
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json(registrations);
});

// @desc Check In / Undo Check In
// @route PUT /api/registrations/:id/checkin
// @access Private (Organizer/Admin)
const toggleCheckIn = asyncHandler(async (req, res) => {
  const registration = await Registration.findById(req.params.id).populate(
    "event"
  );

  if (!registration) {
    return res.status(404).json({
      message: "Registration not found",
    });
  }

  if (
    req.user.role === "organizer" &&
    String(registration.event.organizer) !== String(req.user._id)
  ) {
    return res.status(403).json({
      message: "You can only manage check-ins for your own events",
    });
  }

  // Toggle Check In
  registration.checkedIn = !registration.checkedIn;

  // Update Status
  if (registration.checkedIn) {
    registration.status = "confirmed";
  } else {
    registration.status = "pending";
  }

  await registration.save();

  // Notify participant
  await Notification.create({
    user: registration.user,
    text: registration.checkedIn
      ? `Your attendance has been confirmed for "${registration.event.title}".`
      : `Your attendance check-in has been removed for "${registration.event.title}".`,
  });

  res.json(registration);
});

module.exports = {
  createRegistration,
  getMyRegistrations,
  cancelRegistration,
  getEventRegistrations,
  toggleCheckIn,
};