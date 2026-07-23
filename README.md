# Stress Management System — for IT Professionals

A friendly, easy-to-use stress management system built for developers and IT professionals. No backend, no sign-up email, no database — everything lives in the visitor's own browser (`localStorage`).

## How it flows (each step is its own page)
1. **Login page** — the default screen. Returning users just type username + password. First-time visitors click "Register a new account" to go to the Register page — no one is forced through registration twice.
2. **Register page** — separate page. Username, password, and pick what's currently stressing you out.
3. **Stress assessment page** — shown automatically right after every login/registration. Ten questions, ~2 minutes. The system scores it and identifies your current stress level (Low / Moderate / High / Severe).
4. **Recommend page** — personalized tips based on your stress causes, plus a **top-pick game/trick automatically matched to your current stress level**.
5. **Check-in page** — a fast daily stress rating.
6. **Relief Kit page** — mini games and tricks you can actually play on the site (breathing exercise, Bubble Pop, Mind Sweep, Pomodoro focus timer, habit checklist, break reminders).
7. **Log page** — your history, streak, 7-day average, and CSV export.
8. **Resources page** — for when it's more than the app can help with.

Every page is reachable anytime from the top navigation bar once logged in, and every page ends with **"Created by Malinga Prabath"** in the footer.

## Before → after stress tracking
The breathing exercise, Bubble Pop, and Mind Sweep each ask "how stressed do you feel?" right before you start and right after you finish, then show a result like:

> Before: 7/10 → After: 4/10 — down 3 points. Nice.

That result is also saved into your log, so it shows up in your trend chart and history too.

## Game matched to your stress level
After the assessment, the Recommend page shows a "Top pick right now" card:
- **Low** → Bubble Pop (light, playful reset)
- **Moderate** → Box Breathing
- **High** → Mind Sweep
- **Severe** → 4-7-8 Breathing (plus a nudge toward the Resources page)

## Tech stack
Plain HTML, CSS, and JavaScript — no build tools, no framework, no dependencies.

## Folder structure
```
stress-manager/
├── index.html      # every page: login, register, assessment, recommend, check-in, relief kit, log, resources
├── style.css        # design system
├── script.js         # page navigation, auth, quiz engine, activities, before/after ratings, storage
├── README.md          # this file
└── .gitignore
```

## Run locally in VS Code
1. Open this folder in VS Code (`File → Open Folder…`).
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` → **Open with Live Server**.
4. Site opens at `http://127.0.0.1:5500` and reloads on save.

(No Live Server? Just double-click `index.html` — it still works.)

## Push to GitHub
```bash
cd stress-manager
git init
git add .
git commit -m "Initial commit: Stress Management System"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## Deploy to Vercel
1. [vercel.com](https://vercel.com) → sign in with GitHub.
2. **Add New → Project** → select this repository.
3. Framework preset: **Other** (static site, no build step).
4. **Deploy**. Every future `git push` to `main` auto-deploys.

## Share on LinkedIn
> Built a "Stress Management System" for IT professionals — real login flow, a stress assessment that identifies your current level, matched relief games, and before/after tracking to show the difference. All client-side. [live link] [GitHub link]

## About the login system (please read)
This is a **static site with no server or database** — accounts and all data live in `localStorage` in the visitor's own browser:
- Accounts only work on the same browser/device where they were created.
- Passwords are hashed (SHA-256) before storage, but there's no server-side security or password recovery. **Don't reuse a real/important password.**
- Clearing browser storage deletes the account and all logged data.

For a portfolio piece this is normal and demonstrates the full auth *flow*. For real multi-device accounts, the next step would be a small backend (Supabase, Firebase Auth, or a Node/Express + database API) replacing the `localStorage` calls in `script.js` with API calls.

## Notes
This tool is for self-awareness and quick relief techniques only — not a medical or mental health service. The Resources page points to more serious support options. Browser notifications (break reminders, focus timer alerts) only fire while the tab is open and permission is granted.

---

**Created by Malinga Prabath**
