# Calm Desk — stress care for people who work at a screen

**Live:** https://malingaprabhath7-maker.github.io/Stress-Management-/ · English and සිංහල

Calm Desk is version 2 of my *Stress Management System for IT Professionals*. It helps you notice stress early, calm down in a few minutes and see what actually helps you over time. It works offline and can be installed on a phone like an app.

## What it does

| Page | What you can do |
| --- | --- |
| **Today** | One guided breath, a daily check-in (stress 0–10, hours slept, a short note) and your check-in streak |
| **Stress check** | The 10-question **Perceived Stress Scale (PSS-10)**, one question at a time, with your score, level, tips for the things stressing you and a recommended exercise |
| **Relief kit** | Box breathing and 4-7-8 breathing (with optional rain, ocean, stream or ambient sound), 5-4-3-2-1 grounding, Bubble pop, Mind sweep and a Pomodoro focus timer |
| **My log** | A 30-day stress chart, stress-check history, every relief session with its before → after rating, CSV export and JSON backup and restore |
| **Get help** | Free Sri Lankan helplines (1926, 1333, Sumithrayo, Lanka Life Line) and emergency numbers, one tap to call |

Every relief exercise asks *“how stressed do you feel?”* before and after, so the log shows which exercises work best for you.

## About the stress check

PSS-10 (Cohen, Kamarck and Mermelstein, 1983) is the most widely used questionnaire for everyday perceived stress. Each answer scores 0–4; items 4, 5, 7 and 8 are reverse-scored, giving a total from 0 to 40. Calm Desk reads 0–13 as low, 14–26 as moderate and 27–40 as high. **It is not a diagnosis**, and the app says so next to every result.

## Privacy

There is no account and no server. Everything is saved in the browser’s `localStorage` on your own device, and you can download or delete it from **My log** at any time.

Version 1 had a username and password screen, but the passwords were only stored in the same browser, so it gave a false sense of security. Version 2 removes it and says plainly that the data stays on the device.

## What changed from version 1

- Rebuilt with **Astro 5** and **Tailwind CSS 4**: one page per section, fast static pages, no framework code shipped to the browser
- English **and Sinhala** on every page
- A standard, scored questionnaire (PSS-10) instead of home-made questions
- New: 4-7-8 breathing, 5-4-3-2-1 grounding, background sounds, 30-day chart, backup and restore
- Installable and **offline** (web app manifest and a service worker)
- Dark mode, keyboard-friendly controls and reduced-motion support
- Sound files cut from 27 MB to about 5 MB

The original version is kept on the [`v1-original`](https://github.com/malingaprabhath7-maker/Stress-Management-/tree/v1-original) branch.

## Run it yourself

```bash
npm install
npm run dev      # http://localhost:4321/Stress-Management-/
npm run build    # static site in dist/
```

Every push to `main` builds the site and publishes it to the `gh-pages` branch (`.github/workflows/deploy.yml`).

## Project structure

```
src/
  data/i18n.ts          all text in English and Sinhala, PSS-10 items, helplines
  lib/store.ts          saving and reading data on the device
  lib/session.ts        before/after ratings around an exercise
  components/           Today, Check, Relief, Log, Help, Breath (the breathing orb)
  pages/ and pages/si/  English and Sinhala pages
public/                 sounds, icons, manifest, service worker
```

---

A portfolio project by **Malinga Prabhath** · [portfolio](https://malingaprabhath7-maker.github.io/malinga-portfolio/)

Calm Desk is not a medical service. If you are in danger, call **1990** (ambulance) or **119** (police). For support, call **1926** (National Mental Health Helpline, 24/7).
