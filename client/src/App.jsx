import React from "react";
import { Routes, Route } from "react-router-dom";

import PublicLayout from "./components/PublicLayout";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/public/Home";
import EventsListing from "./pages/public/EventsListing";
import EventDetails from "./pages/public/EventDetails";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import ForgotPassword from "./pages/public/ForgotPassword";
import NotFound from "./pages/public/NotFound";

import ParticipantDashboard from "./pages/participant/Dashboard";
import MyRegistrations from "./pages/participant/MyRegistrations";
import Notifications from "./pages/participant/Notifications";
import ParticipantProfile from "./pages/participant/Profile";

import OrganizerDashboard from "./pages/organizer/Dashboard";
import MyEvents from "./pages/organizer/MyEvents";
import EventForm from "./pages/organizer/EventForm";
import EventRegistrations from "./pages/organizer/EventRegistrations";
import OrganizerProfile from "./pages/organizer/Profile";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminOrganizers from "./pages/admin/Organizers";
import AdminEvents from "./pages/admin/Events";
import AdminRegistrations from "./pages/admin/Registrations";
import AdminReports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";
import AdminLogs from "./pages/admin/Logs";

export default function App() {
  return (
    <div id="app">
      <Routes>
        {/* Public site */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<EventsListing />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<ForgotPassword />} />
        </Route>

        {/* Participant */}
        <Route element={<ProtectedRoute roles={["participant"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<ParticipantDashboard />} />
            <Route path="/registrations" element={<MyRegistrations />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<ParticipantProfile />} />
          </Route>
        </Route>

        {/* Organizer */}
        <Route element={<ProtectedRoute roles={["organizer"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/organizer" element={<OrganizerDashboard />} />
            <Route path="/organizer/events" element={<MyEvents />} />
            <Route path="/organizer/events/new" element={<EventForm />} />
            <Route path="/organizer/events/:id/edit" element={<EventForm />} />
            <Route path="/organizer/events/:id/registrations" element={<EventRegistrations />} />
            <Route path="/organizer/profile" element={<OrganizerProfile />} />
          </Route>
        </Route>

        {/* Admin */}
        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/organizers" element={<AdminOrganizers />} />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="/admin/registrations" element={<AdminRegistrations />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/logs" element={<AdminLogs />} />
          </Route>
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}
