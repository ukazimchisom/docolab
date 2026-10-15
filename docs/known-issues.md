## Deployment (resolved)

- Successfully deployed to Vercel at https://docolab-zeta.vercel.app
  (2026-10-07). Required fixes: Suspense boundary around useSearchParams
  in /login (production build is stricter than dev), NEXT_PUBLIC_SITE_URL
  set as a Vercel "Config" variable, Supabase Auth Site URL/Redirect URLs
  updated to the production domain. All MVP features verified working
  in production: auth, document CRUD, rich text editing, real-time
  comment + content sync with presence, sharing, dark mode.

  ## Testing and tooling (Oct 2026)

### Resolved: Vitest failed to start on Windows

- **Symptom 1:** `Cannot find package 'vite'` when running `npm test`.
  **Cause:** `vite` is a peer dependency, and `.npmrc` sets `legacy-peer-deps=true`, so npm does not install peers automatically.
  **Fix:** `npm install -D vite`. Rule: with `legacy-peer-deps`, list every peer dependency explicitly (this also applied to `@testing-library/dom`).
- **Symptom 2:** `Cannot find native binding` from Rolldown (used by Vite 8).
  **Cause:** npm's optional-dependency bug (npm/cli#4828). The Windows native binary was skipped, even after a clean reinstall.
  **Fix:** added `@rolldown/binding-win32-x64-msvc` (same version as `rolldown`) under `optionalDependencies`, NOT `devDependencies`. Optional means Linux (Vercel, CI) skips it instead of failing with EBADPLATFORM.
  **If it returns:** after upgrading Vite, update that version to match `npm ls rolldown`.

### Open: small items

- `StatusBadge` uses `text-[7px]`, which is too small to read comfortably. Revisit with the design pass.
- `vitest.config.ts` prints two notices: it is ESM syntax in a CommonJS package (rename to `vitest.config.mts`), and Vite now supports tsconfig paths natively (the `vite-tsconfig-paths` plugin can be dropped). Low priority, no functional impact.
- `npm audit` reports 16 vulnerabilities (1 critical). Needs triage, and the critical one should be checked before launch.

### Resolved: Next.js security advisories (Oct 2026)

- `npm audit` flagged Next.js 16.0.0 - 16.3.7 (1 critical: RCE and SSRF in image optimization, cache poisoning, others).
  Upgraded 16.3.1 to 16.4.0. Tests and production build verified before deploy.

### Accepted: npm audit, shadcn CLI chain (7 high)

- `braces` (ReDoS) reaches us only through `shadcn` > `@shadcn/registry` / `ts-morph` > `fast-glob` > `micromatch`.
  This is the component CLI, a build-time tool that does not run in the app's server or browser code.
- `npm audit fix --force` would downgrade `shadcn` to 1.0.0 (breaking). Do NOT run it.
- Re-check with `npm audit --omit=dev` after upgrading `shadcn`; close this item when it ships patched dependencies.

## Export (Oct 2026)

### Accepted limitations

- **Markdown export** drops underline and text alignment (no Markdown equivalent). Images are exported as links to their public storage URLs, so they stop working if the image is deleted or the bucket changes.
- **PDF export** uses the browser's print dialog. Users must choose "Save as PDF", and browsers add a header/footer (URL, date) unless "Headers and footers" is unticked. CSS can't control this. A true one-click PDF would need server-side rendering (for example headless Chromium), which is a Phase 2+ consideration.
- Export is only available inside an open document, not from the documents list (the list doesn't load document content).

### Open: editor autosave

- Leaving the page within 2 seconds of the last keystroke cancels the pending content save, so that final edit may not reach the database. Other connected users still see it live.

## AI summarization (Gemini)

- **Privacy (free tier):** On Google's free Gemini tier, prompt content may be used by Google to improve its products. Before real users' private documents go through this feature, move to a paid tier (different data terms) or another provider. The dialog already tells users their text is sent to Gemini.
- **Model pinned:** Default model is `gemini-3.5-flash-lite`, overridable with the `GEMINI_MODEL` env var. Google retires models, so a failing summary with status 404 usually means the model name needs updating.
- **Saved version only:** Summaries use the last _saved_ content, not live editor state. The button is disabled while a save is pending, but a collaborator's very recent unsaved typing may not be included.
- **Limits:** Only the first 30,000 characters are summarized (the dialog says so). Documents under 100 characters are refused. Images are ignored. Legacy pre-Yjs documents with no real content summarize as "too short".
- **Rate limit:** 10 summaries per user per hour, stored in `ai_summary_requests`. Count-then-insert can overshoot by a request or two under simultaneous clicks. There is no global/daily cap beyond Gemini's own quota (a 429 shows as "service busy"). Rows are never cleaned up, so the table grows forever; a periodic delete of old rows is a future chore.
- **Access:** Owners and any collaborator (including viewers) can summarize a document they can read.
- **Not stored:** Summaries are generated on demand and never saved or streamed.

## Lint (resolved)

- Next 16's ESLint preset includes the new React Compiler rules. They flagged the Yjs doc-in-a-ref pattern (`react-hooks/refs`) in the editor and the mounted-effect in the theme toggle (`react-hooks/set-state-in-effect`). Fixed with a lazy `useState` initializer and `useSyncExternalStore` respectively. `npm run lint` now reports zero problems.
