# SocialTribe Frontend

SocialTribe is a frontend prototype for a two-sided creator marketplace. The app covers both brand and influencer journeys, including onboarding, campaign setup, recommendations, review, chat, submissions, payouts, and profile screens.

This README covers the frontend at the repo root. The verification service in `backend/` is documented separately in [backend/README.md](./backend/README.md).

## Frontend scope

- Brand flow for campaign creation, creator selection, payment, campaign tracking, chat, and profile management
- Influencer flow for signup, verification states, campaign work, content submission, payouts, chat, and profile management
- Mocked data and in-memory app state for fast UI iteration without a required API connection
- Mobile-first routing and layouts built as a single-page React application

## Tech stack

- React 18 + TypeScript
- Vite 6
- React Router 7
- Tailwind CSS 4
- Radix UI, MUI, and Lucide React for UI primitives and icons

## Active app entrypoint

The currently mounted frontend starts here:

- `src/main.tsx`
- `src/App.tsx`
- `src/routes/index.tsx`

There is also a separate `src/app/` prototype tree in the repo. It is useful reference material, but it is not the default app entrypoint wired into `src/main.tsx` right now.

## Project structure

```text
.
|-- src/
|   |-- App.tsx
|   |-- main.tsx
|   |-- components/
|   |-- context/
|   |-- data/
|   |-- hooks/
|   |-- layouts/
|   |-- pages/
|   |-- routes/
|   |-- styles/
|   `-- utils/
|-- backend/
|-- dist/
`-- src/app/
```

## Key routes

- `/` for the landing/auth entry flow
- `/role` for role selection
- `/signup/brand` and `/signup/influencer` for role-specific onboarding
- `/verify`, `/processing`, and `/result` for verification-related prototype screens
- `/brand/*` for the full brand workspace flow
- `/influencer/*` for the full influencer workspace flow

## Getting started

### Prerequisites

- Node.js 18 or newer
- npm

### Install dependencies

```bash
npm install
```

### Start the frontend

```bash
npm run dev
```

Vite will start a local development server, usually on `http://localhost:5173`.

### Create a production build

```bash
npm run build
```

The production output is written to `dist/`.

## Scripts

- `npm run dev` starts the Vite development server
- `npm run build` creates the production bundle

## Data and state

- The frontend currently runs on mock data from `src/data/`
- Cross-page state is managed with React context in `src/context/`
- No frontend environment variables are required for local development
- The app can run independently from the backend during UI work

## Working in this repo

- If you are updating the frontend that is currently mounted, start in `src/`
- If you are exploring alternate UI flows, check `src/app/`
- If you need verification API or database setup, use [backend/README.md](./backend/README.md)

## Design reference

Original Figma source: https://www.figma.com/design/P2FCXxOeoiwU7Hy7g7LOd4/Brndly-Marketplace-Prototype
