# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SafePulse Academy is a Next.js-based online course platform focused on performance science, harm reduction, and longevity education. The platform features student and admin portals, course management, and an AI-powered course assistant.

## Development Commands

```bash
# Install dependencies
cd app && npm install

# Development server (runs on http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint codebase
npm run lint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16.1.6 with App Router
- **Runtime**: React 19.2.3
- **Language**: TypeScript 5
- **Styling**: CSS Modules (`.module.css` files)
- **Authentication**: Custom client-side auth with localStorage (AuthContext)
- **State Management**: React Context API + localStorage
- **AI Integration**: OpenRouter API (Claude 3.5 Sonnet)

### Directory Structure

```
app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Auth route group - login/signup
│   │   ├── (portal)/          # Student portal route group
│   │   │   ├── dashboard/
│   │   │   ├── courses/
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx          # Course detail
│   │   │   │       └── learn/page.tsx    # Course player
│   │   │   └── my-courses/
│   │   ├── (admin)/           # Admin portal route group
│   │   │   └── admin/
│   │   │       └── courses/
│   │   ├── api/               # API routes
│   │   │   └── course-assistant/route.ts
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/            # Shared React components
│   │   ├── Sidebar/
│   │   ├── ArticleRenderer/   # Markdown renderer for course content
│   │   ├── QuizQuestion/
│   │   ├── CourseCertificate/
│   │   ├── AuthGuard/
│   │   ├── ThemeProvider/
│   │   ├── ThemeToggle/
│   │   ├── AccountSettingsModal/
│   │   └── NotificationPanel/
│   ├── lib/                   # Utility libraries
│   │   ├── authContext.tsx    # Auth state management
│   │   └── courseStore.ts     # Course data store (localStorage)
│   └── data/                  # Static course content
│       └── courses/
│           └── athlete-code/  # 50-lesson course on Enhanced Games
│               ├── index.ts   # Course manifest
│               └── content/   # Individual lesson files (.ts)
└── public/                    # Static assets
```

### Route Groups
Next.js route groups organize pages without affecting URLs:
- `(auth)` - Public authentication pages
- `(portal)` - Student-facing pages with portal layout
- `(admin)` - Admin-facing pages with admin layout

Each route group has its own `layout.tsx` that wraps child pages.

### Course System Architecture

**Two course types:**

1. **Demo courses (ID: "1"-"8")**: Hardcoded in `courseStore.ts`, displayed on `/courses` page
2. **Dynamic courses (ID: "athlete-code", etc.)**: Loaded from `data/courses/` directory with lazy-loaded content

**Course data flow:**
- `lib/courseStore.ts` - Central course registry (localStorage-backed)
- Default courses seeded on first load via `ensureDefaults()`
- Dynamic courses loaded via manifest files (e.g., `data/courses/athlete-code/index.ts`)
- Lesson content loaded on-demand in course player (`/courses/[id]/learn`)

**Key interfaces:**
- `CourseRecord` - Course metadata for listings
- `AthleteCodeCourse` / `AthleteCodeLesson` - Dynamic course structure
- Lessons support: `article`, `video`, `quiz` types

### Authentication System

**Client-side only** (no backend):
- State managed by `lib/authContext.tsx`
- User data persisted to localStorage (`sp_auth` key)
- `AuthGuard` component protects portal routes
- Login/signup forms in `(auth)` route group

**User object structure:**
```typescript
interface AuthUser {
  name: string;
  email: string;
  username: string;
  address?: { street, city, state, postcode, country };
  professions?: string[];
  hasPayment?: boolean;
}
```

### State Management

- **Auth**: React Context + localStorage (`authContext.tsx`)
- **Courses**: localStorage + utility functions (`courseStore.ts`)
- **Theme**: localStorage + CSS custom properties (`safepulse-theme` key)
- **UI State**: Local component state (sidebar, modals, etc.)

### Course Player (`/courses/[id]/learn`)

Complex component handling:
- Dual-mode support (demo vs dynamic courses)
- Lazy content loading for dynamic courses
- Progress tracking (localStorage)
- Quiz system with scoring
- Certificate generation on completion
- Collapsible lesson sidebar
- Navigation: prev/next, complete marking

**Content loading flow:**
1. Load course manifest on mount
2. Render lesson list in sidebar
3. On lesson selection, dynamically import content
4. Cache loaded content in state to avoid re-fetches

### AI Course Assistant

**Endpoint**: `/api/course-assistant/route.ts`
- Uses OpenRouter API with Claude 3.5 Sonnet
- Helps admins create course content
- Accepts course context + chat messages
- System prompt tailored for SafePulse domain

**Required environment variables:**
```bash
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet  # optional, defaults to this
```

### Styling System

- CSS Modules for component styles
- Global design tokens in `globals.css`:
  - `--accent`, `--text-primary`, `--bg-primary`, etc.
  - `--space-*` scale for consistent spacing
  - `--radius-*` for border radius
- Dark mode via `data-theme` attribute on `<html>`
- Theme toggle persisted to localStorage

## Creating New Courses

### Adding a Dynamic Course

1. Create course directory: `app/src/data/courses/[course-id]/`
2. Create manifest: `index.ts` with `CourseManifest` structure
3. Add lesson content files in `content/` subdirectory
4. Each lesson exports: `export const content = "markdown string"`
5. Register in `courseStore.ts` default courses array
6. Update `loadDynamicCourse()` in course player to handle new ID

### Lesson Content Format

Lessons use markdown with GitHub Flavored Markdown support:
- Rendered by `ArticleRenderer` component
- Uses `react-markdown` + `remark-gfm`
- Supports: tables, blockquotes, code blocks, lists, etc.

## Path Aliases

`tsconfig.json` defines:
```json
"@/*": ["./src/*"]
```

Use `@/` for all imports from `src/`:
```typescript
import { useAuth } from '@/lib/authContext';
import Sidebar from '@/components/Sidebar/Sidebar';
```

## Important Notes

- All data is client-side (localStorage) - no database yet
- Auth is not secure - purely for UI demonstration
- Course enrollment/purchase not implemented - uses mock data
- Admin and student portals share same Sidebar component with `isAdmin` prop
- Learn page auto-collapses main sidebar to show lesson sidebar
- Version migration system in `courseStore.ts` (`CURRENT_VERSION` constant)

## Working with the Athlete Code Course

The Enhanced Games Athlete Code is a 50-lesson course covering performance-enhancing substances, harm reduction, and athlete protocols. Structure:
- Located in `data/courses/athlete-code/`
- 50 `.ts` files in `content/` directory
- Each lesson has word count for read-time estimation
- Lessons numbered `lesson-01-*` through `lesson-50-*`
- Content uses markdown format with headings, lists, tables

When editing lessons:
1. Edit the `.ts` file in `content/`
2. Content string supports multiline template literals
3. Markdown is rendered at runtime in course player
4. Update word count in manifest if significantly changed
