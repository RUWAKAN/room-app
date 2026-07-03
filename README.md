# Room 🏫💬

> **Your class. Your team. Your space.**

Room is a private class and team management platform that replaces WhatsApp groups, missed emails, and paper attendance registers — for classrooms and corporate teams alike.

**No personal phone numbers. Ever.**

---

## 🚀 Live Demo

Deploy in 60 seconds → drag the `/dist` folder to [netlify.com/drop](https://netlify.com/drop)

---

## ✨ What Room does

| Feature | Description |
|---|---|
| 🏫 **Class & Team Rooms** | Private workspaces per class or project — no cross-subject mix-up |
| 🔒 **Zero number sharing** | Students and faculty interact using Room IDs, never personal numbers |
| 💬 **Group chat** | Real-time messaging with file, PDF, and image sharing |
| 🙋 **Private doubt threads** | 1-on-1 student–faculty chat, invisible to classmates |
| 📢 **Notice board** | Announcements with read receipts — see who has and hasn't read |
| 📁 **Resource hub** | Permanent file library per Room — PDFs, notes, slides, images |
| 📊 **Attendance tracking** | Auto-logged sessions, monthly reports, calendar view |
| 🔗 **QR + link invites** | Join a Room via invite link or QR code — like WhatsApp groups but private |
| 👥 **Multi-faculty support** | Multiple teachers per class, each with their own faculty ID |
| 💼 **Corporate mode** | Same platform works for project teams and company workspaces |

---

## 🛠 Tech stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build tool | Vite |
| Routing | React Router DOM |
| State | React Context + useState |
| Styling | CSS Variables (design tokens) |
| Icons | Emoji-native (zero dependency) |
| Deployment | Static — Netlify / Vercel / GitHub Pages |

---

## 📁 Project structure

```
room-app/
├── public/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx       # Navigation sidebar
│   │   ├── Toast.jsx         # Toast notifications
│   │   └── Modal.jsx         # Create Room / Invite / Notice modals
│   ├── pages/
│   │   ├── Onboarding.jsx    # Login + signup flow (5 screens)
│   │   ├── Dashboard.jsx     # Home — stats, rooms, notices
│   │   ├── RoomsPage.jsx     # Room list + room selector
│   │   ├── RoomView.jsx      # Chat, Notices, Resources, Members, Attendance
│   │   ├── AttendanceOverview.jsx  # All-subject attendance
│   │   ├── AllNotices.jsx    # All notices across Rooms
│   │   └── Settings.jsx      # Profile, theme, privacy
│   ├── context.jsx           # Global app state
│   ├── data.js               # Seed data (rooms, users, messages)
│   ├── App.jsx               # Root component + auth gate
│   ├── main.jsx              # Entry point
│   └── index.css             # Design tokens + global styles
├── index.html
├── vite.config.js
└── package.json
```

---

## ⚡ Getting started

### Prerequisites
- Node.js 18+
- npm or yarn

### Run locally

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/room-app.git
cd room-app

# Install dependencies
npm install

# Start dev server
npm run dev
```

App runs at `http://localhost:5173`

### Build for production

```bash
npm run build
```

Output in `/dist` — deploy anywhere that serves static files.

---

## 🌐 Deploy in 60 seconds

**Netlify (easiest)**
1. Run `npm run build`
2. Go to [netlify.com/drop](https://app.netlify.com/drop)
3. Drag the `dist/` folder
4. Done — live URL instantly

**Vercel**
```bash
npm install -g vercel
vercel
```

**GitHub Pages**
```bash
npm install -g gh-pages
npm run build
gh-pages -d dist
```

---

## 📱 Road to mobile (Play Store / App Store)

This is a web app. To publish on Play Store:

| Option | Effort | Description |
|---|---|---|
| **PWA** | 1 day | Add manifest + service worker — installable from browser |
| **Capacitor** | 2-3 days | Wrap this web app in an Android/iOS shell |
| **React Native** | 2-4 weeks | Rebuild UI natively for best performance |

---

## 🗺 Roadmap

- [ ] PWA support (offline + installable)
- [ ] Real-time backend (Supabase / Firebase)
- [ ] Push notifications
- [ ] File upload (Cloudinary / S3)
- [ ] Google Meet / Zoom link scheduler
- [ ] Admin institution dashboard
- [ ] Mobile app (React Native / Capacitor)
- [ ] Dark / light mode (done ✅)
- [ ] Multi-language support (Hindi, etc.)

---

## 🔐 Privacy model

Room is built around one principle: **your personal phone number is never visible to anyone**.

- Students are identified by their roll number / institution ID
- Faculty are identified by their faculty ID
- No personal contacts are exchanged through the platform
- When a class ends and is archived, all connections end cleanly

---

## 📄 License

MIT License — free to use, modify, and deploy.

---

## 🙌 Contributing

Pull requests welcome. For major changes, open an issue first.

1. Fork the repo
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m 'Add your feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

Built with ❤️ for students, teachers, and teams who deserve better than WhatsApp groups.
