# 🏷️ Lost & Found System – Kwai Chung 2026

Simple, mobile-friendly **Lost & Found** platform with map visualization, bilingual support (English / 中文), quick email-based login, image upload, admin matching tool, and OpenStreetMap integration.

Built as a pure frontend + localStorage application — **no backend server required**.

[https://github.com/yourusername/lost-found-kwai-2026](https://github.com/James-HOT/COMP3510-41.git)

## ✨ Features

- Report lost **or** found items (with photo, geolocation, category, contact info)
- Filter & search items by type / category / free text
- Interactive map showing item locations (Leaflet + Nominatim geocoder)
- Bilingual interface: English ↔ 繁體中文 (with persistent language choice)
- Quick login / register using **email + password** (stored in localStorage)
- Admin mode (special email) can:
  - Match lost + found items (same category + same title)
  - Edit unmatched items
  - Delete any report
- Responsive design (mobile-first)
- Image compression & preview before upload
- Items persist in browser's **localStorage**

## 🎯 Target Use Case

Campus / community / shopping mall lost & found boards  
(e.g. Kwai Chung Plaza, Hong Kong Polytechnic University, local estates…)

## 🚀 Live Demo

(You can host it easily on any static hosting)

- GitHub Pages → [https://yourusername.github.io/lost-found-kwai-2026/](https://github.com/James-HOT/COMP3510-41.git)
- Vercel / Netlify / Cloudflare Pages → drag & drop folder
- Local: just open `index.html` in browser

## Tech Stack

| Layer           | Technology                                 |
|-----------------|--------------------------------------------|
| HTML / CSS      | Vanilla + modern CSS variables             |
| JavaScript      | Vanilla ES6+ (no framework)                |
| Map             | Leaflet 1.9.4 + leaflet-control-geocoder   |
| Geocoding       | Nominatim (OpenStreetMap)                  |
| Storage         | localStorage                               |
| Styling         | Custom CSS (no Tailwind / Bootstrap)       |

## How to Use – Quick Start

1. Open `index.html` in any modern browser
2. Click **Login** → enter any email + password (e.g. `user@abc.com` / `123456`)
3. Click **Report Item** to add lost or found things
4. To become admin → login with `admin@gmail.com` (any password)

## Admin Credentials (hardcoded for demo)

- Email: `admin@gmail.com`  
- Any password works  
→ unlocks **Match Items**, edit & delete everywhere

## Important Limitations / Notes

- **Everything is stored in browser localStorage**  
  → data is **local to each device/browser** — not shared between users
- Matching rule is strict: **exact same category + exact same title** (case-insensitive)
- When admin matches → **found item is deleted**, lost item → status = `matched`
- No email verification, no real authentication
- Photos are stored as data URLs → large images can quickly fill localStorage quota (~5–10 MB)

## Future Improvement Ideas

- Move data to Firebase / Supabase / PocketBase (real multi-user)
- Add chat/contact form between finder & loser
- QR code for each item report
- Push notifications (via PWA + service worker)
- Export / import data
- Better duplicate detection (fuzzy title matching)

## Folder Structure

```text
lost-found-kwai-2026/
├── index.html        # main page
├── styles.css        # all styling
├── script.js         # all logic
└── README.md
