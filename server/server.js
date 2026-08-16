const path = require("path");
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

connectDB();

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "https://event-leaf16.vercel.app",
    "https://event-one-iota.vercel.app"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(express.json());

if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        service: "Eventra API"
    });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/registrations", require("./routes/registrationRoutes"));
app.use("/api/organizer", require("./routes/organizerRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Eventra API server running on port ${PORT}`);
});