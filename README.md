<div align="center">

# 🌐 LifeOS — Personal Life Dashboard

**A fully offline personal productivity system built with vanilla HTML, CSS & JavaScript.**

[![Made with HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![Made with CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Made with JS](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)
[![No Backend](https://img.shields.io/badge/Backend-None-green?style=flat)](.)
[![Offline Ready](https://img.shields.io/badge/Offline-Ready-blueviolet?style=flat)](.)
[![Mobile Friendly](https://img.shields.io/badge/Mobile-Responsive-0ea5e9?style=flat)](.)

---
LIVE TEST : https://badreddinemadad05.github.io/LIFEASSITANT/
*A single-page web app that replaces 10 different apps — manage your daily life, finances, learning, and productivity in one unified, beautiful interface.*

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Modules](#-modules)
  - [Dashboard](#1--dashboard)
  - [Calendar](#2--calendar)
  - [Tasks](#3--tasks)
  - [Learning](#4--learning)
  - [Habits](#5--habits)
  - [Goals](#6--goals)
  - [Notes & Journal](#7--notes--journal)
  - [Finances](#8--finances)
  - [Languages](#9--languages)
  - [Pomodoro](#10--pomodoro)
  - [Statistics](#11--statistics)
  - [Settings](#12--settings)
  - [About Developer](#13--about-developer)
- [Data Storage](#-data-storage)
- [Design System](#-design-system)
- [Mobile Support](#-mobile-support)
- [Developer](#-developer)

---

## 🧠 Overview

**LifeOS** is a personal productivity web application built entirely from scratch using **vanilla HTML, CSS, and JavaScript** — no frameworks, no backend, no database. Everything runs in the browser and persists via `localStorage`.

The goal was to build a single system that replaces multiple apps:

| Instead of | LifeOS has |
|---|---|
| Google Calendar | Calendar module (day/week/month views) |
| Todoist | Tasks module with priorities & deadlines |
| Habitica | Habits tracker with streaks |
| Notion | Notes + daily journal |
| Budget apps | Full finances tracker with charts |
| Duolingo | Language learning module |
| Forest / Pomodoro apps | Built-in Pomodoro timer + focus mode |
| Analytics dashboards | Statistics with charts & history |

---

## 🚀 Live Demo

> Open `index.html` in any modern browser — no installation, no server needed.

```bash
# Clone the repo
git clone https://github.com/badreddinemadad05/lifeos.git

# Open in browser
open index.html
# or just double-click the file
```

---

## ✨ Features

### Core Functionality
- ✅ **13 fully functional modules** in a single page — no page reloads
- ✅ **100% offline** — works without internet after first load
- ✅ **localStorage persistence** — data survives browser restarts
- ✅ **Export / Import** — backup all your data as JSON
- ✅ **Dark & Light mode** — with system-native color scheme
- ✅ **Custom accent color** — personalize the theme in Settings
- ✅ **Real-time clock** — auto-refreshes date at midnight
- ✅ **Fully responsive** — works on desktop, tablet, and mobile

### Productivity
- ✅ Daily score ring (tasks + habits completion percentage)
- ✅ Celebration animations with confetti when tasks are completed
- ✅ Tomorrow preview on dashboard
- ✅ Quick-add modal accessible from any page
- ✅ Pomodoro focus mode with full-screen overlay and particles

### Personal Finance
- ✅ Monthly income/expense tracking with navigation between months
- ✅ Budget progress bar with color-coded warnings
- ✅ Doughnut chart breakdown by category
- ✅ Net savings and savings rate calculation

### Learning
- ✅ Language learning (Dutch & English) with 4 status levels
- ✅ Daily 10-phrase goal with progress tracking
- ✅ Streak counter
- ✅ Subject & lesson management with study time tracking

---

## 📸 Screenshots

> *Below are the main pages of LifeOS.*

| Dashboard | Finances | Languages |
|---|---|---|
| Score ring, tasks, habits, goals summary | Monthly budget, chart, transactions | Phrase cards with status badges |

| Pomodoro Focus | Statistics | About Developer |
|---|---|---|
| Full-screen focus mode with particles | Charts by period (week/month/year) | Developer portfolio page |

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **HTML5** | — | Page structure & semantic markup |
| **CSS3** | — | Full design system (1800+ lines) |
| **JavaScript ES6+** | — | All logic, modules, data (3900+ lines) |
| **Chart.js** | 4.4.0 (CDN) | Doughnut & bar charts |
| **localStorage** | Browser API | Data persistence |
| **SVG** | Inline | All icons + progress rings |

**Zero dependencies** beyond Chart.js. No React, no Vue, no Node.js, no server.

---

## 📁 Getting Started

### Requirements
- Any modern browser (Chrome, Firefox, Safari, Edge)
- No internet required after first load (Chart.js loads from CDN on first use)

### Installation

```bash
# 1. Download or clone
git clone https://github.com/badreddinemadad05/lifeos.git

# 2. Navigate to folder
cd lifeos

# 3. Open index.html in your browser
#    Double-click the file OR:
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

That's it. No `npm install`, no build step, no server.

---

## 📂 Project Structure

```
lifeos/
│
├── index.html          # Full app structure (all pages, modals, nav)
├── style.css           # Complete design system (~2600 lines)
│   ├── CSS custom properties (dark/light theme variables)
│   ├── Layout (sidebar, topbar, content)
│   ├── Components (cards, buttons, modals, forms)
│   ├── Module-specific styles (finances, languages, about...)
│   └── Responsive breakpoints (768px, 480px, 390px)
│
├── app.js              # All JavaScript logic (~3900 lines)
│   ├── DB         — localStorage abstraction layer
│   ├── Utils      — Date formatting, helpers
│   ├── Modal      — Modal manager
│   ├── Toast      — Notification system
│   ├── Celebration — Confetti + celebration cards
│   ├── DashModule — Dashboard
│   ├── CalModule  — Calendar
│   ├── TaskModule — Tasks
│   ├── LearnModule — Learning (subjects & lessons)
│   ├── HabitModule — Habits + logs
│   ├── GoalModule — Goals
│   ├── NotesModule — Notes & Journal
│   ├── FinanceModule — Finances
│   ├── LangModule — Languages
│   ├── PomodoroModule — Pomodoro timer
│   ├── StatsModule — Statistics
│   ├── SettingsModule — Settings
│   └── App — Main coordinator (navigation, init)
│
├── IMG-DEV.jpg         # Developer profile photo
├── IMG-LG.png          # Site logo
├── README.md           # This file
└── DOCUMENTATION.md    # Full technical documentation (French)
```

---

## 📦 Modules

### 1. 🏠 Dashboard

The homepage. Displays a **complete daily overview** in one glance.

**Components:**
- **Daily Score Ring** — SVG circular progress showing % of tasks + habits completed today. Animates with CSS `stroke-dashoffset`. Goes green (🏆) at 100%.
- **Today's Schedule** — All calendar events for today, sorted by time
- **Today's Tasks** — Pending tasks with quick-complete checkbox + quick-delete button. Hides completed tasks automatically. Shows tomorrow's tasks when all done.
- **Today's Habits** — Remaining habits to validate. Shows "all done 🌟" when complete.
- **Quick Stats** — 4 widgets: tasks done this week, habit rate today, study hours this week, active goals
- **Goals Preview** — Top 4 active goals with progress bars
- **Daily Quote** — Random motivational quote on each load

**Celebration system:** Completing a task or habit triggers a confetti animation with a personalized message (`"Yaaay! Good work, [Name]! 🎉"`). Completing everything triggers a grand celebration (90 confetti pieces, 3.8s, 🏆).

---

### 2. 📅 Calendar

Full calendar with **3 views**:

| View | Navigation | Description |
|---|---|---|
| **Day** | ±1 day | Hourly timeline with positioned event blocks |
| **Week** | ±7 days | 7-column grid, scrollable horizontally on mobile |
| **Month** | ±1 month | Classic calendar grid (6×7) |

**Events include:** title, date, start/end time, color, location, category, notes.

**Day view** positions events using absolute CSS:
- `top = (start_minutes - startHour*60) px`
- `height = duration_in_minutes px`

A **red line** marks the current time and updates every 60 seconds.

---

### 3. ✅ Tasks

Full task management system.

**Task fields:** title, priority (high/medium/low), status (todo/in-progress/done), deadline, time, category.

**Features:**
- Filter by status and priority
- Sort by priority then time
- Quick-toggle from dashboard (marks done + triggers celebration)
- Quick-delete button (visible on hover / always visible on touch)
- `completedAt` field stored for historical statistics

---

### 4. 📚 Learning

Study management organized into **subjects → lessons**.

**Subjects:** name, color, level (beginner / intermediate / advanced / expert)

**Lessons:** title, duration, date, status (todo / in-progress / done), notes, linked to a subject

Progress bar shows lessons completed per subject. Deleting a subject removes all its lessons automatically.

---

### 5. ⭐ Habits

Daily habit tracking with **streak counting**.

**Habit logs** are stored as:
```json
{ "2026-03-16": { "habit_id": true } }
```

A **streak** is computed by walking backwards from today, counting consecutive days the habit was done.

The **weekly grid** shows the last 7 days as a visual pattern for each habit.

Completing a habit from the dashboard triggers a celebration and celebration if all habits are done.

---

### 6. 🎯 Goals

Long-term goal tracking with **visual progress bars**.

**Goal fields:** title, description, category, start date, target date, priority, progress (0–100%), status.

- Progress updated via a slider
- Days remaining warning (red when < 7 days)
- Mark as completed → moves to completed list

---

### 7. 📝 Notes & Journal

Two-tab module:

**Notes tab**
- Two-panel layout: list (left) + editor (right)
- Pinned notes (📌) always appear first
- Auto-sort: pinned → most recently modified
- Fields: title + free-text content

**Journal tab**
- One entry per day (indexed by `YYYY-MM-DD`)
- Fields: free text + mood emoji (😊 😐 😔 😤 😴)
- Displays all past entries below the editor

---

### 8. 💰 Finances

Monthly income and expense tracker.

**Navigation:** `←` / `→` buttons change `currentMonth` (format `YYYY-MM`). Uses local date methods (not `toISOString()`) to avoid UTC timezone offset bugs.

**Expense categories:**

| Key | Label | Color |
|---|---|---|
| `groceries` | Courses | 🟢 Green |
| `rent` | Loyer | 🟣 Purple |
| `leisure` | Loisirs | 🟠 Orange |
| `transport` | Transport | 🔵 Blue |
| `personal` | Achat personnel | 🟤 Mauve |
| `other` | Autre dépense | ⚫ Gray |

**Income categories:** Job étudiant 💼, Autre revenu 💰

**Calculations:**
- Net savings = Income − Expenses
- Savings rate = (Savings / Income) × 100
- Budget bar: green < 80%, orange 80–100%, red > 100%

**Chart:** Chart.js doughnut (`cutout: 65%`) showing expense breakdown. Destroyed and recreated on each render to avoid Canvas conflicts.

---

### 9. 🌍 Languages

Phrase-based language learning module.

**Supported languages:** 🇧🇪 Dutch · 🇬🇧 English

**Phrase status levels:**

| Status | Meaning | Color |
|---|---|---|
| `new` | Just added | Gray |
| `learning` | In progress | Orange |
| `learned` | Mastered | Green |
| `review` | Needs review | Red |

**Daily goal:** 10 phrases. A dot-progress bar shows the 10 most recent phrases with color-coded status dots.

**Streak:** Counts consecutive days where at least one phrase was added or updated.

**Filters:** Today / To review / All / Learned + full-text search.

---

### 10. ⏱️ Pomodoro

Focus timer implementing the **Pomodoro Technique**.

**Configurable settings:**
- Work session duration (5–120 min, default 25)
- Short break (1–30 min, default 5)
- Long break (5–60 min, default 15)
- Sessions before long break (2–8, default 4)

**Focus Mode** (full-screen overlay):
- SVG ring timer with animated gradient (purple = work, green = break)
- Floating particle animations in background
- Random motivational messages that change each phase
- Browser tab title updates: `"⏱ 24:45 | Work — LifeOS"`
- Can be linked to a **subject** or a **task** for contextual tracking

---

### 11. 📊 Statistics

Historical data analysis across **3 time periods**: Week / Month / Year.

**Charts (Chart.js):**
- Bar chart: tasks per day
- Bar chart: habits per day
- Line chart: productivity rate over time

**Daily History:** Reconstructs past days from `completedAt` fields on tasks and `habitLogs` — no extra storage needed. Shows the last 14 days with score, tasks done, and habits validated.

---

### 12. ⚙️ Settings

**Options:**
- User name and avatar initial
- Dark / Light theme toggle
- Primary color picker (applied instantly via CSS custom properties)
- Calendar start/end hours

**Data Management:**
- **Export:** Downloads `lifeos-backup-YYYY-MM-DD.json` containing all data
- **Import:** Restores all data from a JSON backup file

---

### 13. 👤 About Developer

A **personal portfolio page** embedded within the app. Displays:

- Profile photo with animated gradient ring
- Name, title, location, availability status
- Social links (Email, LinkedIn, GitHub, GitLab)
- Education (BSc Computer Science, University of Namur)
- Technical skills with color-coded badges (Python, Java, C, Rust, HTML, CSS, JS...)
- 5 featured projects with tags
- Work experience
- Language proficiency bars (Arabic, French, English, Dutch)

---

## 💾 Data Storage

All data is stored in `localStorage` with the prefix `lifeos_`.

| Key | Type | Content |
|---|---|---|
| `lifeos_settings` | Object | User preferences |
| `lifeos_events` | Array | Calendar events |
| `lifeos_tasks` | Array | All tasks |
| `lifeos_subjects` | Array | Learning subjects |
| `lifeos_lessons` | Array | Lessons per subject |
| `lifeos_habits` | Array | Habit definitions |
| `lifeos_habitLogs` | Object | `{ "YYYY-MM-DD": { habitId: bool } }` |
| `lifeos_goals` | Array | Goals with progress |
| `lifeos_notes` | Array | Notes |
| `lifeos_journal` | Object | `{ "YYYY-MM-DD": { text, mood } }` |
| `lifeos_transactions` | Array | Financial transactions |
| `lifeos_phrases` | Array | Language learning phrases |

**ID generation:**
```js
Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
// Example: "lzr8k4a2m" — unique, compact, timestamp-based
```

**Data safety:** All user-input text is escaped via `Utils.escHtml()` before rendering in the DOM, preventing XSS injection.

---

## 🎨 Design System

### Theme Architecture
Controlled by `data-theme` attribute on `<html>`:
- Default → **dark mode** (`color-scheme: dark`)
- `data-theme="light"` → **light mode** (`color-scheme: light`)

### CSS Custom Properties (key variables)
```css
:root {
  --primary: #6366f1;        /* Indigo accent */
  --bg: #020817;             /* Page background */
  --bg-card: rgba(255,255,255,0.04); /* Card background */
  --text-primary: #f1f5f9;   /* Main text */
  --text-secondary: #94a3b8; /* Secondary text */
  --radius: 12px;            /* Border radius */
  --transition: all 0.22s ease;
}
```

### Visual Effects
- **Glassmorphism:** `backdrop-filter: blur(24px)` + semi-transparent backgrounds
- **3D Tilt:** Cards tilt on mouse move via `perspective(800px) rotateY() rotateX()` — disabled on touch devices
- **Ambient Background:** CSS radial gradients + noise texture overlay
- **Animated ring (About page):** CSS `@keyframes` spinning gradient border

### Responsive Breakpoints
| Breakpoint | Target | Key changes |
|---|---|---|
| `1100px` | Large tablet | Finance grid collapses |
| `900px` | Tablet | Dashboard/stats go single column |
| `768px` | Mobile | Sidebar off-canvas, bottom nav appears, modals slide up |
| `480px` | Small mobile | Tighter padding, lesson items wrap, goal actions wrap |
| `390px` | iPhone / small Android | Score card stacks vertically, smaller ring, social icons only |

---

## 📱 Mobile Support

LifeOS is fully optimized for mobile use:

- **Bottom navigation bar** with 6 key pages + "More" button (opens sidebar)
- **Sidebar** slides in as overlay when "More" or hamburger is tapped
- **Modals** slide up from the bottom instead of appearing centered
- **`safe-area-inset`** support for iPhones with Dynamic Island / notch
- **`font-size: 16px`** on all inputs → prevents iOS Safari auto-zoom
- **`100dvh`** height → correct sizing with dynamic browser bar
- **Touch targets** minimum 44×44px (Apple/Google standard)
- **`-webkit-overflow-scrolling: touch`** for smooth scrolling on iOS
- **Horizontal scroll** on calendar week view (wrapped in overflow container)
- **3D tilt effects disabled** on touch devices (no hover = no glitches)

---

## 👨‍💻 Developer

<table>
<tr>
<td>

**Badreddine Madad**
BSc Computer Science Student
University of Namur — Belgium

</td>
</tr>
</table>

| Platform | Link |
|---|---|
| 📧 Email | [badreddine.madad@gmail.com](mailto:badreddine.madad@gmail.com) |
| 💼 LinkedIn | [linkedin.com/in/badreddine-madad-b18a81299](https://www.linkedin.com/in/badreddine-madad-b18a81299/) |
| 🐙 GitHub | [github.com/badreddinemadad05](https://github.com/badreddinemadad05) |
| 🦊 GitLab | [gitlab.com/badreddinemadad05](https://gitlab.com/badreddinemadad05) |

---

## 📄 License

This project is a **personal project** built for learning and productivity purposes.
Feel free to explore the code and use it as inspiration for your own projects.

---

<div align="center">

**Built with ❤️ by Badreddine Madad — 2026**

*LifeOS — One app to manage your entire life.*

</div>
