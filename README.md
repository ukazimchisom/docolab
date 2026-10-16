<div align="center">

# Docolab

**Real-time collaborative document editing for teams, with built-in AI summaries.**

Write together, see each other's cursors and presence live, comment, export, and summarize, all in the browser.

[![CI](https://github.com/ukazimchisom/docolab/actions/workflows/ci.yml/badge.svg)](https://github.com/ukazimchisom/docolab/actions/workflows/ci.yml)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%7C%20Realtime%20%7C%20Storage-3ECF8E?logo=supabase&logoColor=white)
![Tests](https://img.shields.io/badge/tests-63%20passing-brightgreen)

**[Live demo](https://docolab-zeta.vercel.app)** · **[Report a bug](https://github.com/ukazimchisom/docolab/issues)** ·

</div>

---

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Available scripts](#available-scripts)
- [Testing](#testing)
- [CI/CD and deployment](#cicd-and-deployment)
- [AI summarization](#ai-summarization)
- [Security](#security)
- [Known issues and limitations](#known-issues-and-limitations)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Docolab is a collaborative, web-based document editor built for teams that need to draft, edit, and review documents together: product managers writing PRDs, technical writers maintaining documentation, business teams preparing resolutions.

Multiple people can edit the same document at the same time. Changes merge automatically and conflict-free, collaborators appear live in the document, and every edit is saved to the database in the background.

The project is a full-stack Next.js application with a public marketing landing page and an authenticated productivity app that share one design system. It was built incrementally, with a strong emphasis on testing, small reviewable pull requests, and documenting trade-offs as it went.

## Features

### Collaboration

- **Real-time co-editing** powered by [Yjs](https://yjs.dev) CRDTs, so concurrent edits merge without conflicts
- **Live presence**: see who else is in the document, plus a connection status indicator
- **Comments** on documents, with live updates
- **Invite collaborators by email** and share documents with a team
- **Role-based access**: owner and editor permissions enforced on the server, with Row Level Security in the database

### Editor

- Rich text editing with [TipTap](https://tiptap.dev): headings, bold, italic, underline, lists, links, text alignment, code blocks, quotes
- **Image upload** directly into the document (Supabase Storage)
- **Autosave**: edits are saved automatically a couple of seconds after you stop typing, with a visible Saving / Saved / Error indicator
- Editable document title, kept in sync with the sidebar and recent-documents list

### Organization

- Dashboard with recent documents
- Document categories and status workflow: **Draft, In progress, Review, Complete**
- Folders for grouping documents
- Basic analytics queries for the dashboard

### Export and AI

- **Export to Markdown** (`.md`) with one click
- **Export to PDF** through a print-optimized layout (browser _Save as PDF_)
- **AI summarization**: a Summarize button generates a short bullet summary of the saved document using Google Gemini, with a per-user rate limit and a copy button

### Product and polish

- Public landing page (hero, features, social proof, FAQ, CTA)
- Light and dark themes, with no flash of the wrong theme
- Responsive layout, accessible components (Radix primitives), toast notifications
- Loading skeletons and empty states

## Screenshots

| Landing page                                    | Dashboard                                      |
| ----------------------------------------------- | ---------------------------------------------- |
| ![Landing page](public/screenshots/landing.png) | ![Dashboard](public/screenshots/dashboard.png) |

| Editor with live collaboration           | AI summary                                    |
| ---------------------------------------- | --------------------------------------------- |
| ![Editor](public/screenshots/editor.png) | ![AI summary](public/screenshots/summary.png) |

[live demo](https://docolab-zeta.vercel.app).

## Tech stack

| Area                    | Technology                                                                                                                          |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Framework               | [Next.js 16](https://nextjs.org) (App Router, Server Actions, Turbopack)                                                            |
| Language                | TypeScript                                                                                                                          |
| UI                      | React, [Tailwind CSS v4](https://tailwindcss.com) with the typography plugin, [shadcn/ui](https://ui.shadcn.com) (Radix primitives) |
| Icons and toasts        | [Phosphor Icons](https://phosphoricons.com), [Sonner](https://sonner.emilkowal.ski)                                                 |
| Theming                 | [next-themes](https://github.com/pacocoursey/next-themes)                                                                           |
| Editor                  | [TipTap v3](https://tiptap.dev) (ProseMirror)                                                                                       |
| Real-time sync          | [Yjs](https://yjs.dev) over Supabase Realtime                                                                                       |
| Auth, storage, realtime | [Supabase](https://supabase.com) (Auth, Realtime, Storage, Postgres with Row Level Security)                                        |
| Database access         | [Drizzle ORM](https://orm.drizzle.team)                                                                                             |
| AI                      | [Google Gemini API](https://ai.google.dev) (REST, called server-side only)                                                          |
| Export                  | [Turndown](https://github.com/mixmark-io/turndown) (HTML to Markdown), print stylesheet for PDF                                     |
| Testing                 | [Vitest](https://vitest.dev), [React Testing Library](https://testing-library.com), user-event, jest-dom                            |
| Tooling                 | ESLint (Next.js config with React Compiler rules)                                                                                   |
| CI/CD                   | GitHub Actions, [Vercel](https://vercel.com)                                                                                        |

## Architecture

### High-level overview

```mermaid
flowchart LR
    Browser["Browser<br/>Next.js client + TipTap + Yjs"]
    Server["Next.js server<br/>Server Actions + Route rendering"]
    Supabase["Supabase<br/>Auth, Realtime, Storage"]
    DB[("Postgres<br/>documents, comments, ...")]
    Gemini["Google Gemini API"]

    Browser <-->|"Yjs updates + presence"| Supabase
    Browser -->|"Server Actions"| Server
    Server -->|"Drizzle ORM"| DB
    Server -->|"auth.getUser()"| Supabase
    Server -->|"summarize (key stays here)"| Gemini
    Browser -->|"image uploads"| Supabase
```

### How real-time collaboration works

1. Each open document holds a **Yjs `Y.Doc`**. TipTap's Collaboration extension binds the editor to it.
2. Local edits produce small Yjs updates, which are **broadcast to other collaborators over a Supabase Realtime channel** for that document. Presence on the same channel powers the live avatars and connection indicator.
3. Because Yjs is a CRDT, updates can arrive in any order and every client converges to the same document with no conflict resolution code.
4. Roughly two seconds after the last keystroke, the full Yjs state is **encoded to Base64 and saved** to `documents.content` through a Server Action, so the document is durable and loads instantly next time.
5. On load, the saved state is applied to a fresh `Y.Doc` before the editor mounts.

### Authorization model

| Role                  | View | Edit and comment | Summarize | Invite | Delete |
| --------------------- | :--: | :--------------: | :-------: | :----: | :----: |
| Owner                 | Yes  |       Yes        |    Yes    |  Yes   |  Yes   |
| Editor (collaborator) | Yes  |       Yes        |    Yes    |   No   |   No   |
| Viewer (collaborator) | Yes  |        No        |    Yes    |   No   |   No   |

Every Server Action authenticates the user with Supabase and then checks ownership or collaborator membership **on the server**. Row Level Security adds a second layer in the database.

### Data model

| Table                    | Purpose                                                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `profiles`               | App-level profile data (name, initials, avatar color, email) extending Supabase `auth.users`                        |
| `folders`                | Per-user folders for grouping documents                                                                             |
| `documents`              | Title, category, status, Base64 Yjs `content`, owner, folder, timestamps                                            |
| `document_collaborators` | Per-document membership with a role (`owner`, `editor`, `viewer`)                                                   |
| `comments`               | Document comments, with an authorized-user list used for access filtering                                           |
| `ai_summary_requests`    | One row per summarize attempt, used for per-user rate limiting (RLS enabled with no policies, so it is server-only) |

The schema lives in [`src/db/schema.ts`](src/db/schema.ts).

### AI summarization flow

```mermaid
sequenceDiagram
    participant U as User
    participant B as Browser
    participant S as Server Action
    participant D as Postgres
    participant G as Gemini

    U->>B: Click Summarize
    B->>S: summarizeDocument(documentId)
    S->>S: Authenticate and check access
    S->>D: Load saved document
    S->>S: Extract text from Yjs state, validate length
    S->>D: Check and record rate-limit usage
    S->>G: Prompt (document wrapped as data)
    G-->>S: Summary
    S-->>B: Typed result (ok or friendly error)
    B->>U: Bullets in a dialog, with Copy
```

The browser sends only a document ID. The server loads the text itself, so the endpoint cannot be used as an open proxy to Gemini.

## Project structure

```
docolab/
├── .github/workflows/ci.yml      # Lint, test, build on every PR
├── docs/
│   └── known-issues.md           # Documented limitations and trade-offs
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (app)/                # Authenticated application
│   │   │   ├── actions.ts        # Server Actions (documents, comments, invites)
│   │   │   └── ai-actions.ts     # Server Action: summarizeDocument
│   │   └── ...                   # Landing page, auth routes, layouts
│   ├── components/
│   │   ├── app/                  # Product components (editor, toolbar, export, summarize, ...)
│   │   └── ui/                   # shadcn/ui primitives
│   ├── db/
│   │   ├── index.ts              # Drizzle client
│   │   └── schema.ts             # Tables, enums, relations
│   ├── lib/
│   │   ├── ai/                   # Gemini client, text extraction, prompt, rate limit, formatting
│   │   ├── hooks/                # use-yjs-sync (realtime + presence)
│   │   ├── queries/              # Read queries (dashboard, analytics)
│   │   ├── supabase/             # Supabase clients for server and browser
│   │   ├── validations/          # Input validation schemas
│   │   ├── export.ts             # Markdown export helpers
│   │   └── yjs-content.ts        # Encode and load Yjs state
│   └── types/                    # Shared TypeScript types
├── vitest.config.ts
├── vitest.setup.ts
└── package.json
```

## Getting started

### Prerequisites

- **Node.js 22** and **npm**
- A free **[Supabase](https://supabase.com)** project
- _(Optional)_ A **[Google AI Studio](https://aistudio.google.com)** API key, only needed for AI summaries

### 1. Clone and install

```bash
git clone https://github.com/ukazimchisom/docolab.git
cd docolab
npm install
```

The repository includes an `.npmrc` with `legacy-peer-deps=true`, which is required for the current dependency set. Don't remove it.

### 2. Set up Supabase

1. Create a new Supabase project.
2. From **Project Settings**, copy the **Project URL**, the **anon public key**, and the **Postgres connection string** (use the pooled connection string for serverless hosting).
3. Under **Authentication**, enable email sign-in and add `http://localhost:3000` to the allowed redirect URLs.
4. Create the database schema from [`src/db/schema.ts`](src/db/schema.ts), either by applying it with your Drizzle workflow or by running equivalent SQL in the Supabase SQL editor. This includes the `ai_summary_requests` table:

   ```sql
   create table public.ai_summary_requests (
     id uuid primary key default gen_random_uuid(),
     user_id uuid not null references public.profiles(id) on delete cascade,
     created_at timestamptz not null default now()
   );

   create index ai_summary_requests_user_created_idx
     on public.ai_summary_requests (user_id, created_at desc);

   alter table public.ai_summary_requests enable row level security;
   ```

5. Enable Row Level Security and add policies for your tables as appropriate for your deployment (see [Security](#security)).
6. Create a **Storage bucket** for document images. The expected bucket name is set in [`src/lib/upload-image.ts`](src/lib/upload-image.ts).

### 3. Configure environment variables

Create a `.env.local` file in the project root (it is git-ignored). See the [table below](#environment-variables) for what each value does:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DATABASE_URL=postgres://user:password@host:5432/postgres

# Optional: enables AI summaries
GEMINI_API_KEY=your-gemini-key
```

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), create an account, and create your first document. To try real-time collaboration, open the same document in a second browser window signed in as another user.

## Environment variables

| Variable                        | Required | Scope             | Description                                                                          |
| ------------------------------- | :------: | ----------------- | ------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`      |   Yes    | Client and server | Your Supabase project URL                                                            |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` |   Yes    | Client and server | Supabase anon (public) key. Safe to expose; protected by RLS                         |
| `NEXT_PUBLIC_SITE_URL`          |   Yes    | Client and server | Public base URL of the app (`http://localhost:3000` locally)                         |
| `DATABASE_URL`                  |   Yes    | **Server only**   | Postgres connection string used by Drizzle                                           |
| `GEMINI_API_KEY`                |  For AI  | **Server only**   | Google Gemini API key. Without it, Summarize returns a friendly "not set up" message |
| `GEMINI_MODEL`                  |    No    | **Server only**   | Override the default Gemini model (default: `gemini-3.5-flash-lite`)                 |

> **Never commit `.env.local` or paste keys into issues, PRs, or chat.** Anything prefixed `NEXT_PUBLIC_` is bundled into the browser; everything else stays on the server.

## Available scripts

| Command              | What it does                                            |
| -------------------- | ------------------------------------------------------- |
| `npm run dev`        | Start the development server                            |
| `npm run build`      | Create a production build                               |
| `npm start`          | Serve the production build                              |
| `npm run lint`       | Run ESLint (must pass with zero errors; enforced in CI) |
| `npm test`           | Run the test suite once                                 |
| `npm run test:watch` | Run tests in watch mode                                 |
| `npx tsc --noEmit`   | Type-check the whole project                            |

## Testing

Tests use **Vitest** with **React Testing Library**. The suite currently has **63 tests across 10 files**, covering:

- **Export**: HTML-to-Markdown conversion, safe filenames, Markdown document assembly
- **AI**: Yjs text extraction, input limits and prompt building, the Gemini client (HTTP error mapping, blocked and empty responses, mocked `fetch`), summary formatting
- **Components**: toolbar buttons and status badges, tested by what a user sees and does
- **Utilities and validation**: auth schemas, formatting, user helpers

```bash
npm test            # run once
npm run test:watch  # re-run on change
```

Server-side tests opt in to the Node environment with a `// @vitest-environment node` comment at the top of the file; component tests use jsdom by default.

Before opening a PR, all three of these should pass:

```bash
npx tsc --noEmit
npm run lint
npm test
```

## CI/CD and deployment

### Continuous integration

[GitHub Actions](.github/workflows/ci.yml) runs on every pull request and on pushes to `master`:

1. `npm ci`
2. `npm run lint`
3. `npm test`
4. `npm run build` (with placeholder environment variables, so no real secrets are used in CI)

### Deployment on Vercel

- Every pull request gets a **Vercel preview deployment** to test the real production build.
- Merging to `master` deploys to **production** automatically.
- Set the environment variables from the [table above](#environment-variables) in your Vercel project. Mark `DATABASE_URL` and `GEMINI_API_KEY` as sensitive, and enable them for both Production and Preview.
- Make sure your Supabase project's allowed redirect URLs include your Vercel domain.

## AI summarization

The **Summarize** button generates up to five bullet points describing the document's **last saved version**.

**How it behaves**

- Runs entirely server-side; the API key is never sent to the browser.
- Works on text extracted from the saved Yjs state, so only users who can read a document can summarize it.
- Documents shorter than 100 characters are refused; only the first 30,000 characters of very long documents are summarized (the dialog says so).
- The document is wrapped in tags and the model is instructed to treat it as data, which reduces the impact of instructions hidden inside a document.
- Rate limited to **10 summaries per user per hour**, backed by the `ai_summary_requests` table.
- Results are shown in a dialog and are **never stored**.

**Privacy note.** On Google's _free_ Gemini tier, prompt content may be used by Google to improve its products. That is fine for development, but before real users' private documents go through this feature, switch to a paid tier or another provider. The summary dialog tells users that their text is sent to Gemini.

**Changing models.** The default model is set in `src/lib/ai/gemini.ts` and can be overridden with `GEMINI_MODEL`. Models get retired over time; a `404` from the API usually means the model name needs updating.

## Security

- **Authentication** is handled by Supabase Auth; sessions are verified on the server with `auth.getUser()` in every Server Action.
- **Authorization** is checked on the server for every mutation and read (owner or collaborator membership), never trusting the client.
- **Row Level Security** is enabled in Postgres as a second layer. The `ai_summary_requests` table has RLS enabled with no policies, so it is unreachable from the browser.
- **Secrets** (`DATABASE_URL`, `GEMINI_API_KEY`) are server-only and are never exposed through `NEXT_PUBLIC_` variables.
- **Rate limiting** protects the AI endpoint from abuse and runaway cost.
- **Dependencies** are audited regularly (`npm audit`). Don't use `npm audit fix --force`; review upgrades individually.

Found a vulnerability? Please report it privately to the maintainer instead of opening a public issue.

## Known issues and limitations

The full, up-to-date list is in [`docs/known-issues.md`](docs/known-issues.md). Highlights:

- **Markdown export** does not preserve underline or text alignment, and images are exported as links.
- **PDF export** uses the browser's print dialog; browser-added headers and footers can't be controlled from CSS (turn them off in the print dialog).
- **Autosave edge case**: navigating away within about two seconds of the last keystroke can cancel the pending save.
- **Legacy documents** created before the Yjs migration may open empty once.
- **AI summaries** reflect the last _saved_ version, not unsaved typing; the free Gemini tier has privacy implications.

## Troubleshooting

<details>
<summary><strong>Windows: <code>Cannot find native binding</code> when running tests</strong></summary>

The test toolchain uses a native binary per platform. On Windows x64, `@rolldown/binding-win32-x64-msvc` is declared under `optionalDependencies` in `package.json`. If you hit this after a fresh clone, delete `node_modules` and `package-lock.json`, then run `npm install` again. This is a known npm optional-dependency bug ([npm/cli#4828](https://github.com/npm/cli/issues/4828)).

</details>

<details>
<summary><strong><code>Cannot find package 'vite'</code></strong></summary>

With `legacy-peer-deps=true`, peer dependencies are not installed automatically. `vite` and `@testing-library/dom` are listed explicitly in `devDependencies` for this reason. Run `npm install` to restore them.

</details>

<details>
<summary><strong>Summarize says it isn't set up or fails</strong></summary>

- Confirm `GEMINI_API_KEY` is set (in `.env.local` locally, or in Vercel for deployments) and **restart the dev server**, since env files are only read at startup.
- A `404` in the server log usually means the configured model was retired; set `GEMINI_MODEL` to a current one.
- A `429` means the Gemini quota is exhausted; Summarize shows a "service is busy" message.
- "Relation does not exist" means the `ai_summary_requests` table hasn't been created in that Supabase project.
</details>

<details>
<summary><strong>Real-time sync isn't working</strong></summary>

Check that Realtime is enabled for your Supabase project, that both users have access to the document, and that the badge in the editor header says **Live** rather than **Connecting...**.

</details>

<details>
<summary><strong>Hydration warnings in the console</strong></summary>

Browser extensions that modify the page (dark-mode extensions, translators) can cause these. Try an incognito window to rule it out.

</details>

## Roadmap

**Shipped**

- [x] Real-time collaborative editing with presence
- [x] Comments and collaborator invites
- [x] Image upload, autosave, categories and statuses
- [x] Test suite and CI with lint, test and build
- [x] Export to Markdown and PDF
- [x] AI summarization with rate limiting

**Planned**

- [ ] Version history with restore
- [ ] Document templates
- [ ] Activity log
- [ ] Admin dashboard
- [ ] Offline support
- [ ] End-to-end tests (Playwright) against a dedicated test project
- [ ] Branch protection and required checks on `master`
- [ ] Accessibility audit improvements

## Contributing

Contributions, issues, and suggestions are welcome.

### Workflow

1. **Branch from `master`** using a descriptive name: `feature/<name>`, `fix/<name>`, `docs/<name>`, or `chore/<name>`.
2. Make small, focused commits using [Conventional Commits](https://www.conventionalcommits.org):
   `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`, `ci:`
3. Make sure these pass locally:
   ```bash
   npx tsc --noEmit
   npm run lint
   npm test
   ```
4. Push and open a **pull request** into `master`. CI must be green.
5. Test the **Vercel preview** deployment, not just `localhost`.
6. Merge, delete the branch, and verify production.

### Guidelines

- Add or update tests for behavior you change.
- Keep server-side authorization checks in Server Actions; never rely on the client.
- Never commit secrets. `.env.local` is git-ignored.
- Record deliberate trade-offs and limitations in [`docs/known-issues.md`](docs/known-issues.md).

## License

MIT

---

<div align="center">

Built with Next.js, Supabase, TipTap, and Yjs.

</div>
