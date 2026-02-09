# ATAR Study Platform

A comprehensive study platform for Year 11 and 12 Australian high school students. Modern, responsive, and fully functional front-end application with simulated backend functionality using localStorage.

## Features

### Core Study Tools
- **Marker** - AI-powered response grading with detailed feedback (what went well, areas for improvement, example responses)
- **Guide** - Question breakdown assistant that explains command words, suggests structure, and identifies common pitfalls
- **Practice** - Question generator with subject/topic/difficulty filters and integrated grading

### Study Tools
- **Subject Dashboard** - Track progress across subjects with interactive syllabus maps and AI-suggested focus areas
- **Flashcards** - Create decks manually or with AI generation, study with spaced repetition
- **Study Sessions** - Collaborative study with Pomodoro timer, music player, and friend invites

### Progress & Planning
- **Analytics** - Study statistics, heatmap calendar, achievement badges, strengths/weaknesses analysis
- **Study Planner** - Weekly timetable with drag-to-add events, exam countdown, daily/weekly goals
- **Friends & Leaderboard** - Weekly study leaderboard, friend profiles, study challenges

### Additional
- **Resource Library** - Upload and organize study materials by subject
- **Settings** - Profile customization, theme toggle (dark/light), Pomodoro preferences, goal settings
- **ATAR Goal Tracker** - Set and track progress toward your ATAR goal

## Setup & Running

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Any static file server

### Quick Start

1. Clone the repository
2. Serve the files with any static server:

```bash
# Using Node.js serve
npx serve .

# Using Python
python3 -m http.server 3000

# Using PHP
php -S localhost:3000
```

3. Open `http://localhost:3000` in your browser

### No Build Step Required
This application is built with vanilla JavaScript (ES6+) and requires no build tools, bundlers, or package managers. Simply serve the files and open in a browser.

## Architecture

```
atar-study-platform/
├── index.html              # Entry point
├── css/
│   ├── main.css           # Variables, theme, layout, utilities
│   ├── components.css     # Reusable component styles
│   └── pages.css          # Page-specific styles
├── js/
│   ├── core/
│   │   ├── store.js       # Reactive state management (localStorage-backed)
│   │   ├── router.js      # Hash-based SPA router
│   │   └── component.js   # Rendering helpers
│   ├── utils/
│   │   ├── helpers.js     # Utility functions
│   │   └── mockAI.js      # Simulated AI responses
│   ├── data/
│   │   ├── mockData.js    # Mock data (subjects, questions, friends, etc.)
│   │   └── storage.js     # Storage operations layer
│   ├── components/
│   │   ├── Sidebar.js     # Navigation sidebar
│   │   ├── TopBar.js      # Top navigation bar
│   │   ├── Modal.js       # Modal dialog system
│   │   ├── Timer.js       # Pomodoro timer
│   │   └── Charts.js      # Chart components (bar, donut, heatmap, sparkline)
│   ├── pages/
│   │   ├── Auth.js        # Login/signup
│   │   ├── Onboarding.js  # Initial setup flow
│   │   ├── Dashboard.js   # Home screen
│   │   ├── Marker.js      # AI response grading
│   │   ├── Guide.js       # Question breakdown
│   │   ├── Practice.js    # Question generator
│   │   ├── Subjects.js    # Subject dashboard
│   │   ├── Flashcards.js  # Flashcard system
│   │   ├── StudySessions.js # Collaborative study
│   │   ├── Analytics.js   # Progress & stats
│   │   ├── Planner.js     # Study planner
│   │   ├── Friends.js     # Friends & leaderboard
│   │   ├── Resources.js   # Resource library
│   │   └── Settings.js    # Profile & preferences
│   └── app.js             # Application entry & routing
└── README.md
```

## Technical Details

- **No framework dependencies** - Built with vanilla JavaScript using a component-based architecture
- **State Management** - Custom reactive store backed by localStorage
- **Routing** - Hash-based SPA router with route guards for authentication
- **Styling** - CSS custom properties for theming, responsive grid, and utility classes
- **Data Persistence** - All data stored in localStorage (survives browser sessions)
- **Mock AI** - Template-based response generation that simulates AI analysis
- **Responsive** - Mobile-first design that works on desktop, tablet, and mobile

## Subjects Included

English, Mathematics, Biology, Chemistry, Physics, History, Geography, Economics, Legal Studies, Psychology, Physical Education, Visual Arts, Music, Digital Technologies

## Mock Data

The platform includes pre-populated:
- Sample marked responses with feedback
- Mock friend profiles with activity stats
- Pre-built flashcard decks (English Literary Techniques, Biology Cell Structure)
- Practice question bank across multiple subjects
- Example syllabus structures
- Study session history
- Resource library samples
