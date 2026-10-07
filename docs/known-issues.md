## Deployment (resolved)

- Successfully deployed to Vercel at https://docolab-zeta.vercel.app
  (2026-10-07). Required fixes: Suspense boundary around useSearchParams
  in /login (production build is stricter than dev), NEXT_PUBLIC_SITE_URL
  set as a Vercel "Config" variable, Supabase Auth Site URL/Redirect URLs
  updated to the production domain. All MVP features verified working
  in production: auth, document CRUD, rich text editing, real-time
  comment + content sync with presence, sharing, dark mode.
