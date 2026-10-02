# SpaceCode

SpaceCode is an educational platform for learning programming and data science through real scientific and space data.

## What is already included

- Responsive landing page
- Learning paths for Python, Data Science, Web Development, APIs, Git/GitHub and Intro ML
- Mini lessons and trusted external resources
- Mini quizzes after modules
- Local progress saving before Supabase is connected
- Supabase-ready email OTP authentication
- Supabase-ready progress, quiz, analytics and project tables
- Profile dashboard
- Admin analytics page (role-protected through Row Level Security)
- NASA APOD + Near-Earth Object data lab
- Portfolio project lab
- Community section placeholder with moderation-first design
- Starter idea for a global student ocean sensor network
- Safe research-inspired spectroscopy/ML educational project idea using public/synthetic data only

## Run locally

Because this project uses JavaScript modules, serve it through a local web server.

### Option A — Python

```bash
python -m http.server 5500
```

Open: `http://localhost:5500`

### Option B — VS Code Live Server

Install the “Live Server” extension, then open `index.html` with Live Server.

## Connect Supabase

1. Create a Supabase project.
2. Open **SQL Editor** and run `supabase/schema.sql`.
3. Go to **Project Settings -> API**.
4. Copy the project URL and publishable/anon key into `js/config.js`.
5. Go to **Authentication -> Email Templates -> Magic Link** (or the OTP email template available in your project).
6. Configure the email template to send the OTP token (`{{ .Token }}`) rather than only a magic-link URL so the 6-digit code flow works.
7. Create your account through SpaceCode.
8. In Supabase, find your user UUID and run the commented admin update statement at the end of `schema.sql` to make yourself an admin.

## Important security note

The Supabase publishable/anon key is allowed in frontend code. Security comes from **Row Level Security (RLS)**, which this starter enables. Never put a Supabase `service_role` key in this project or in a public GitHub repository.

## Deploy to GitHub Pages

This is a static site, so it can be deployed directly with GitHub Pages.

1. Push the project to GitHub.
2. Repository -> Settings -> Pages.
3. Deploy from your main branch/root.
4. After deployment, add your GitHub Pages URL to Supabase Authentication allowed redirect/site URLs if required.

## Suggested next development phases

1. Improve lesson content and add 3–5 real exercises per module.
2. Add code-submission exercises (safe sandboxed execution; do not run arbitrary code on the same server as the app).
3. Add project submission forms and portfolio pages.
4. Add charts to admin analytics and retention funnels.
5. Add more real datasets (NASA, astronomy catalogs, climate/ocean public data).
6. Add badges and streaks.
7. Add moderated community posts only after moderation/reporting controls exist.
8. Build the student buoy prototype and ingest sensor data into a separate measurements table/API.

## Folder structure

```text
spacecode/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── config.js
│   ├── router.js
│   ├── components/
│   │   └── layout.js
│   ├── data/
│   │   ├── modules.js
│   │   └── projects.js
│   ├── pages/
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── community.js
│   │   ├── home.js
│   │   ├── learn.js
│   │   ├── module.js
│   │   ├── profile.js
│   │   ├── projects.js
│   │   └── space-data.js
│   └── services/
│       ├── analytics.js
│       ├── auth.js
│       ├── nasa.js
│       ├── progress.js
│       └── supabase.js
└── supabase/
    └── schema.sql
```
