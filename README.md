# 🌊 Godhavari Nadhi Paryavarana Parishubratha
### Centralized Digital Platform (Public Website, Admin Dashboard & Member Mobile App)

A full-stack **MERN (MongoDB Atlas, Express.js, React, Node.js)** platform designed and implemented in strict alignment with the **Product Requirements Document (PRD)**, **Technical Requirements Document (TRD)**, **System Architecture Document**, and **UI/UX Design Specification** for **Godhavari Nadhi Paryavarana Parishubratha**.

---

## 🔑 Administrator & Member Credentials

Your live MongoDB Atlas database has been seeded with the following credentials:

| Portal | Login Email / Identifier | Password | Role / Account Details |
|---|---|---|---|
| **Administrator** | `admin@gmail.com` | `admin123` | **Chief Administrator** (Full Access) |
| **Member Portal** | `lakshmi@example.com` | `password123` | Life Member (`GNPP-2026-1002`) |
| **Volunteer Portal** | `ramu@example.com` | `password123` | Active Volunteer (`GNPP-2026-1003`) |

> *Tip: "Quick Fill" demo buttons are provided on both login screens (`/admin/login` and `/member/login`) for instant 1-click test sign-in.*

---

## 🏛️ Digital Systems & Redesigned Pages

### 1. 🌐 Simple & Proficient Public Website (`/`)
- **Header & Navbar**: Clean top utility indicator with emergency helpline, Rajahmundry headquarters tag, direct Member Login & Admin Portal links.
- **Home (`/`)**: Refined minimalist hero, clean impact metrics strip (148+ Drives, 92+ Tons Waste Removed, 1,280+ Active Volunteers, 22 Ghats Maintained), 3 core action pillars, featured cleanliness drives, and public bulletins.
- **About Us (`/about`)**: Clean vision & mission cards, 4 strategic focus areas (ghat sanitation, canal plastic traps, bund afforestation, eco-friendly offerings), and executive leadership profiles.
- **Cleanliness Drives (`/activities`)**: Clean filter tabs (All, Cleanliness Drive, Awareness Program, Workshop, Tree Plantation), responsive card grid with volunteer counters.
- **Awareness Programs (`/awareness`)**: Clean editorial layout showcasing student rallies (*Nadi Vandanam*), merchant workshops, and citizen water testing labs.
- **Events Calendar (`/events`)**: Chronological timeline cards with date blocks, time, venue, and participation CTA.
- **Announcements (`/announcements`)**: Clean official bulletin stack with priority tags (`Urgent`, `Important`, `Notice`).
- **Contact Secretariat (`/contact`)**: 2-column layout with verified Bund Road office info, emergency helplines, and a clean inquiry form.
- **Footer**: Structured footer with organization bypass links, legal info, and contact details.

### 2. 🛡️ Admin Dashboard (`/admin`)
- **Access Route**: `/admin` (Protected by `AdminRoute`, login at `/admin/login`).
- **Overview Center**: High-level KPI tiles calculated directly from MongoDB Atlas.
- **Member Management (`/admin/members`)**: Search, filter, enroll new members, assign IDs (`GNPP-2026-XXXX`), toggle membership statuses (`Active`, `Suspended`).
- **Drives & Events Management (`/admin/events`)**: Create, schedule, edit, and delete cleanliness drives and awareness events.
- **Meetings Management (`/admin/meetings`)**: Schedule Executive Committee and Volunteer briefings with discussion agendas.
- **Announcements Publisher (`/admin/announcements`)**: Publish urgent river alerts, meeting circulars, and official updates.
- **Notification Dispatcher Studio (`/admin/notifications`)**: Broadcast instant in-app alerts and mobile notifications to member devices.

### 3. 📱 Member Mobile Application (`/member`)
- **Access Route**: `/member` (Protected by `MemberRoute`, login at `/member/login`).
- **Responsive Mobile Frame**: Authentic native mobile app layout with top app bar, organization badge, and persistent bottom tab navigation.
- **Digital Membership Card (`/member/card`)**: Official printable/savable virtual ID card complete with Member ID, photo, membership tier, validity dates, verified seal, and digital QR code verification badge.
- **Drives & Cleanliness Activities (`/member/drives`)**: Member-exclusive field cleanups with instant volunteer enrollment.
- **Meetings & Circulars (`/member/meetings`, `/member/announcements`)**: Access to internal executive meetings, agendas, and circulars.
- **Member Profile (`/member/profile`)**: Manage personal details, blood group, address, and session logout.

---

## 🚀 How to Run the Project

### 1. Start the Backend API Server:
```powershell
cd C:\Users\Lenovo\Desktop\NGO\backend
npm start
# or with live-reload:
npm run dev
```
*API runs on: [http://localhost:5000](http://localhost:5000)*

### 2. Start the Frontend React Client:
```powershell
cd C:\Users\Lenovo\Desktop\NGO\frontend
npm run dev
```
*Client runs on: [http://localhost:5173](http://localhost:5173)*
