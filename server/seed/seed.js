/**
 * Seed script — populates the database with demo data matching the
 * original Eventra reference prototype (users, events, registrations, etc).
 *
 * Usage: npm run seed        (from the server/ directory, with .env configured)
 *        npm run seed -- --destroy   (wipes all collections instead of seeding)
 */
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");

const User = require("../models/User");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const Notification = require("../models/Notification");
const ActivityLog = require("../models/ActivityLog");
const OrganizerApplication = require("../models/OrganizerApplication");

const run = async () => {
  await connectDB();

  if (process.argv.includes("--destroy")) {
    await Promise.all([
      User.deleteMany(),
      Event.deleteMany(),
      Registration.deleteMany(),
      Notification.deleteMany(),
      ActivityLog.deleteMany(),
      OrganizerApplication.deleteMany(),
    ]);
    console.log("All collections cleared.");
    process.exit(0);
  }

  await Promise.all([
    User.deleteMany(),
    Event.deleteMany(),
    Registration.deleteMany(),
    Notification.deleteMany(),
    ActivityLog.deleteMany(),
    OrganizerApplication.deleteMany(),
  ]);

  // Users — passwords are hashed automatically by the User model's pre-save hook
  const [asha, rohan, priya, david, admin] = await User.create([
    { name: "Asha Verma", email: "asha@campus.edu", password: "demo123", role: "participant" },
    { name: "Rohan Mehta", email: "rohan@campus.edu", password: "demo123", role: "participant" },
    { name: "Priya Nair", email: "priya.organizer@campus.edu", password: "demo123", role: "organizer", organization: "Design Guild" },
    { name: "David Chen", email: "david.organizer@campus.edu", password: "demo123", role: "organizer", organization: "Tech Society" },
    { name: "Admin User", email: "admin@eventra.com", password: "admin123", role: "admin" },
  ]);

  const events = await Event.create([
    {
      title: "DevConnect 2026 — Full Stack Summit", category: "Technology", organizer: priya._id,
      date: "2026-07-14", time: "09:00", venue: "Innovation Hall A", capacity: 240, status: "open",
      price: 0, color: "blue",
      desc: "A full day of talks and hands-on workshops covering the MERN stack, system design, and shipping real products. Built for students and early-career developers who want to go beyond tutorials.",
      tags: ["Workshop", "Networking", "Free"],
    },
    {
      title: "Design Systems Workshop", category: "Design", organizer: priya._id,
      date: "2026-07-02", time: "14:00", venue: "Studio 4B", capacity: 60, status: "open",
      price: 200, color: "purple",
      desc: "Build a token-based design system from scratch — color, type, components — and ship it as a working component library by the end of the session.",
      tags: ["Hands-on", "Design"],
    },
    {
      title: "Campus Hackathon — Build for Good", category: "Technology", organizer: david._id,
      date: "2026-08-08", time: "08:00", venue: "Main Auditorium", capacity: 300, status: "open",
      price: 0, color: "green",
      desc: "24-hour hackathon. Teams of up to 4 build a working prototype addressing a real community problem. Mentors on-site, prizes for top 3 teams.",
      tags: ["Competition", "Free", "Teams"],
    },
    {
      title: "AI & Ethics Panel Discussion", category: "Seminar", organizer: david._id,
      date: "2026-07-22", time: "17:30", venue: "Lecture Theatre 2", capacity: 150, status: "open",
      price: 0, color: "orange",
      desc: "A panel of researchers and industry practitioners discuss the practical ethics of deploying AI systems at scale, followed by open Q&A.",
      tags: ["Panel", "Free"],
    },
    {
      title: "Startup Pitch Night", category: "Business", organizer: priya._id,
      date: "2026-06-30", time: "18:00", venue: "Innovation Hall B", capacity: 120, status: "closed",
      price: 100, color: "blue",
      desc: "Student founders pitch to a panel of investors and alumni for funding and mentorship. Registration has closed for this cohort.",
      tags: ["Pitch", "Closed"],
    },
    {
      title: "Photography Masterclass", category: "Arts", organizer: david._id,
      date: "2026-09-05", time: "10:00", venue: "Media Lab", capacity: 40, status: "draft",
      price: 150, color: "green",
      desc: "A hands-on masterclass on composition, lighting, and editing — taught by a working photojournalist. Not yet published.",
      tags: ["Draft"],
    },
  ]);

  const [devconnect, design, hackathon, panel] = events;

  await Registration.create([
    { event: devconnect._id, user: asha._id, status: "confirmed", checkedIn: false, code: "DCN-7741" },
    { event: hackathon._id, user: asha._id, status: "confirmed", checkedIn: false, code: "HCK-2290" },
    { event: design._id, user: asha._id, status: "pending", checkedIn: false, code: "DSW-5512" },
    { event: devconnect._id, user: rohan._id, status: "confirmed", checkedIn: true, code: "DCN-3387" },
    { event: panel._id, user: rohan._id, status: "cancelled", checkedIn: false, code: "AEP-9081" },
  ]);

  await Notification.create([
    { user: asha._id, text: "Your registration for DevConnect 2026 is confirmed.", read: false },
    { user: asha._id, text: "Design Systems Workshop registration is pending payment confirmation.", read: false },
    { user: asha._id, text: "Reminder: Campus Hackathon starts in 3 weeks.", read: true },
  ]);

  await ActivityLog.create([
    { actor: "Admin User", action: "Approved organizer account", target: "David Chen" },
    { actor: "Priya Nair", action: "Published event", target: "DevConnect 2026" },
    { actor: "System", action: "Auto-closed registration", target: "Startup Pitch Night" },
  ]);

  await OrganizerApplication.create([
    { name: "Meera Iyer", email: "meera.org@campus.edu", password: "$2a$10$placeholderhashplaceholderhashplaceh", org: "Robotics Club" },
    { name: "Carlos Diaz", email: "carlos.org@campus.edu", password: "$2a$10$placeholderhashplaceholderhashplaceh", org: "Music Society" },
  ]);

  console.log("Database seeded successfully.");
  console.log("Demo accounts (password: demo123 / admin: admin123):");
  console.log("  Participant: asha@campus.edu");
  console.log("  Organizer:   priya.organizer@campus.edu");
  console.log("  Admin:       admin@eventra.com");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
