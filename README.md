# Eventra — Event Registration & Management (MERN Stack)

A full-stack conversion of the Eventra reference prototype into a real **MongoDB + Express + React + Node** application, with JWT authentication and three roles: **Participant**, **Organizer**, and **Admin**.

## Project structure

```
eventra-mern/
├── server/              Express + MongoDB API
│   ├── config/          DB connection
│   ├── models/          Mongoose schemas (User, Event, Registration, Notification, ActivityLog, OrganizerApplication)
│   ├── middleware/      JWT auth, role guards, error handling
│   ├── controllers/     Route logic
│   ├── routes/          Express routers
│   ├── seed/            Demo-data seed script
│   └── server.js        App entry point
└── client/              React (Vite) frontend
    └── src/
        ├── api/          Axios instance (auto-attaches JWT)
        ├── context/       Auth + Toast providers
        ├── components/    Navbar, Sidebar, TicketCard, layouts, guards
        ├── pages/public/       Home, Events, Event details, About, Contact, Login, Register, Forgot password
        ├── pages/participant/  Dashboard, My Registrations, Notifications, Profile
        ├── pages/organizer/    Dashboard, My Events, Create/Edit Event, Event Registrations, Profile
        └── pages/admin/        Dashboard, Organizers, Events, Registrations, Reports, Settings, Logs
```

## Prerequisites

- Node.js 18+
- A MongoDB instance — either local (`mongod`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

## 1. Backend setup

```bash
cd server
npm install
cp .env.example .env
# edit .env: set MONGO_URI to your local or Atlas connection string, and a real JWT_SECRET
npm run seed     # populates demo users/events/registrations
npm run dev      # starts the API on http://localhost:5000
```

### Demo accounts (created by the seed script)

| Role        | Email                          | Password  |
|-------------|---------------------------------|-----------|
| Participant | asha@campus.edu                 | demo123   |
| Organizer   | priya.organizer@campus.edu      | demo123   |
| Admin       | admin@eventra.com               | admin123  |

## 2. Frontend setup

```bash
cd client
npm install
cp .env.example .env   # VITE_API_URL defaults to http://localhost:5000/api
npm run dev            # starts on http://localhost:5173
```

The Vite dev server also proxies `/api` to `http://localhost:5000`, so the app works even without setting `VITE_API_URL` explicitly.

## Core features implemented

- **Auth**: JWT login/register, bcrypt password hashing, `/auth/me`, profile update, forgot-password stub
- **Public site**: Home, browsable/filterable Events listing, Event details with live registration counts, About, Contact
- **Participant**: register/cancel for events, view "My Registrations", notifications, profile
- **Organizer**: dashboard stats, create/edit/delete own events, view & check-in registrations per event
- **Admin**: platform stats, approve/reject organizer applications, manage all events & registrations, suspend/reactivate users, reports (revenue, fill rate, category breakdown), activity log, settings UI
- **Role-based route protection** on both the API (Express middleware) and the frontend (React route guards)

## Notes / things to configure before production use

- Set a strong, random `JWT_SECRET` in `server/.env`.
- The "Forgot password" and "Settings" flows are functional endpoints/UI but intentionally simplified (no real email delivery) — wire up an email provider (e.g. SendGrid, SES) if needed.
- CORS is restricted to `CLIENT_URL` in `.env`; update it for your deployed frontend origin.
- Organizer applications are stored in a separate `OrganizerApplication` collection until an admin approves them, at which point a real `User` account with role `organizer` is created.
