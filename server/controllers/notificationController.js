const { asyncHandler } = require("../middleware/auth");
const Notification = require("../models/Notification");

// @desc Get logged-in user's notifications
// @route GET /api/notifications
// @access Private
const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(notifications);
});

// @desc Mark a notification as read
// @route PUT /api/notifications/:id/read
// @access Private
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({ _id: req.params.id, user: req.user._id });
  if (!notification) return res.status(404).json({ message: "Notification not found" });
  notification.read = true;
  await notification.save();
  res.json(notification);
});

// @desc Mark all of the user's notifications as read
// @route PUT /api/notifications/read-all
// @access Private
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  res.json({ message: "All notifications marked as read" });
});

module.exports = { getMyNotifications, markAsRead, markAllAsRead };
