# ReVanced Student Portal

A modern, reimagined wrapper for the legacy JSP student portal. Built with Next.js 16, WebGL shaders, and a glassmorphism design system.

![Landing Page](https://img.shields.io/badge/Landing-WebGL_Shader-blue?style=flat-square)
![Auth](https://img.shields.io/badge/Auth-Human_In_The_Loop-orange?style=flat-square)
![Dashboard](https://img.shields.io/badge/Dashboard-Horizontal_Scroll-purple?style=flat-square)

## Overview

ReVanced wraps the legacy student portal behind a fluid, modern interface. It proxies authentication through a Human-in-the-Loop (HITL) flow — the user sees a polished login form with the portal's CAPTCHA, and credentials are forwarded to the original JSP backend.

### Architecture

```
┌──────────────┐     ┌───────────────────────┐     ┌─────────────────┐
│   Browser    │────▶│  Next.js Edge Routes  │────▶│  Legacy Portal  │
│  (React UI)  │◀────│  /api/auth/start      │◀────│  (JSP Backend)  │
│              │     │  /api/auth/login       │     │                 │
└──────────────┘     └───────────────────────┘     └─────────────────┘
```

- **`/api/auth/start`** — Bootstraps a portal session, extracts JSESSIONID + security tokens, proxies the CAPTCHA image as Base64
- **`/api/auth/login`** — Forwards credentials + CAPTCHA to the portal's `SLoginServlet`
- **Frontend** — Horizontal-scroll landing page → Login form → Dashboard

## Prerequisites

- **Node.js ≥ 20.9.0** (required by Next.js 16)
- **npm** or **pnpm**

> **Getting the Node 16 error?** You're running an outdated Node.js. Update it:
> ```bash
> # Using nvm (recommended)
> nvm install 20
> nvm use 20
>
> # Or using Homebrew (macOS)
> brew install node@20
> ```

## Getting Started

```bash
# Clone the repo
git clone https://github.com/FrostedBottlers/Student_Portal.git
cd Student_Portal

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
.
├── app/
│   ├── page.tsx                    # Landing page (horizontal scroll: Home → Sign In → About)
│   ├── layout.tsx                  # Root layout (dark theme, Geist fonts)
│   ├── globals.css                 # Design system (oklch tokens, Tailwind v4)
│   ├── api/auth/
│   │   ├── start/route.ts          # Session bootstrap + CAPTCHA proxy (Edge)
│   │   └── login/route.ts          # Credential forwarding (Edge)
│   └── portal/
│       ├── layout.tsx              # Portal shell (sidebar + header)
│       ├── page.tsx                # Redirect → /portal/dashboard
│       └── dashboard/page.tsx      # Horizontal at-a-glance dashboard
├── components/
│   ├── custom-cursor.tsx           # Lerp-smoothed dot cursor
│   ├── grain-overlay.tsx           # SVG noise film grain
│   ├── magnetic-button.tsx         # Magnetic hover button
│   ├── theme-provider.tsx          # Dark/light mode
│   └── portal/
│       ├── portal-sidebar.tsx      # Grouped collapsible navigation
│       ├── portal-header.tsx       # Search + notifications + avatar
│       ├── dashboard-stats.tsx     # Stat cards (attendance, CGPA, etc.)
│       ├── student-profile-card.tsx # Full profile display
│       └── recent-activity.tsx     # Exams + notifications panels
├── hooks/
│   └── use-reveal.ts              # IntersectionObserver scroll reveal
├── lib/
│   ├── utils.ts                   # cn() class merge helper
│   └── mock-data.ts               # Mock student data (replaced by scraper later)
└── public/                        # Static assets
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.1 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4 |
| Shaders | `shaders` npm package (WebGL Swirl + ChromaFlow) |
| Icons | Lucide React |
| Theming | next-themes |
| CSS Tokens | oklch color space |
| Auth | Edge Runtime API routes |

## Pages

### `/` — Landing Page
Horizontal-scroll with 3 sections:
1. **Home** — WebGL shader background, hero text, CTA
2. **Sign In** — Glassmorphism login card with CAPTCHA (HITL auth)
3. **About** — Project info, feature highlights

### `/portal/dashboard` — Dashboard
Horizontal-scroll with 4 panels:
1. **Overview** — Stats cards + quick action tiles
2. **Courses** — Current semester courses table
3. **Activity** — Upcoming exams + notifications
4. **Profile** — Full student profile card

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORTAL_BASE_URL` | Legacy portal base URL | `https://sp.srmist.edu.in` |

## Development Notes

### CSS Warnings in VS Code
If you see `Unknown at rule @custom-variant` / `@theme` / `@apply` warnings, these are **false positives**. Tailwind CSS v4 uses these directives natively. The included `.vscode/settings.json` disables VS Code's built-in CSS validator in favor of the Tailwind CSS IntelliSense extension.

Install the [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) extension for proper autocomplete and validation.

### Node.js Version
Next.js 16 requires **Node.js ≥ 20.9.0**. The `.nvmrc` file is included — run `nvm use` in the project root to switch automatically.

## License

AGPL-3.0 — see [LICENSE.txt](LICENSE.txt)
