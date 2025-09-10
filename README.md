## Workify FE (WIP)

A React + TypeScript + Vite frontend for the Workify recruitment platform. This repository is a work-in-progress and currently focuses on the core pages, reusable UI components, and routing setup.

### Stack
- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4, Radix UI, Lucide Icons
- React Router v7
- React Hook Form + Zod
- TanStack Query

### Quick Start
```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# http://localhost:5173

# Lint
npm run lint

# Build production bundle
npm run build

# Preview production build
npm run preview
```

### Project Structure (short)
```text
src/
  components/      # Reusable UI (Radix + Tailwind) and feature components
  layouts/         # Page layouts (Main, Employer, ...)
  pages/           # Screens (Home, JobSearch, JobDetail, Auth, Employer, ...)
  routes/          # AppRoutes, Public/Employer routes
  lib/             # Utilities (e.g., utils.ts)
  App.tsx, main.tsx
```

- Path alias: `@` → `./src` (see `vite.config.ts`).

### Notes
- This codebase is under active development; features and structure may change.
- Contributions welcome once the initial milestone is stable.

### Roadmap (high level)
- Auth flows and protected routes
- Job search & filters integration
- Employer dashboard enhancements
- API integration with backend
- Accessibility and performance pass
