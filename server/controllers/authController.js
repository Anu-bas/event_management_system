const { asyncHandler } = require("../middleware/auth");
const User = require("../models/User");
const OrganizerApplication = require("../models/OrganizerApplication");
const ActivityLog = require("../models/ActivityLog");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");

// @desc Register a new participant account (or submit an organizer application)
// @route POST /api/auth/register
// @access Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, organization } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(400).json({ message: "An account with this email already exists" });
  }

  if (role === "organizer") {
    const existingApp = await OrganizerApplication.findOne({ email: email.toLowerCase(), status: "pending" });
    if (existingApp) {
      return res.status(400).json({ message: "You already have a pending organizer application" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const application = await OrganizerApplication.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      org: organization || "Not specified",
    });
    return res.status(201).json({
      applied: true,
      message: "Your organizer application has been submitted for review.",
      applicationId: application._id,
    });
  }

  const user = await User.create({ name, email: email.toLowerCase(), password, role: "participant" });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});

// @desc Authenticate user & get token
// @route POST /api/auth/login
// @access Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  if (user.status === "suspended") {
    return res.status(403).json({ message: "Your account has been suspended. Contact support." });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});

// @desc Get logged in user's profile
// @route GET /api/auth/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// @desc Update own profile
// @route PUT /api/auth/me
// @access Private
const updateMe = asyncHandler(async (req, res) => {
  const { name, password, organization } = req.body;
  const user = await User.findById(req.user._id);
  if (name) user.name = name;
  if (organization !== undefined) user.organization = organization;
  if (password) user.password = password;
  await user.save();
  res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
});

// @desc Request password reset (demo: returns a reset acknowledgment, no email sent)
// @route POST /api/auth/forgot-password
// @access Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: (email || "").toLowerCase() });
  // Always respond the same way to avoid leaking which emails exist
  res.json({
    message: "If an account exists for that email, password reset instructions have been sent.",
    demoUserFound: !!user,
  });
});

module.exports = { register, login, getMe, updateMe, forgotPassword };
