# Security notes

## Required Vercel configuration

Set these as **Production Environment Variables** in the Vercel project settings:

- `NABDA_ADMIN_EMAIL`
- `NABDA_ADMIN_PASSWORD`

The admin password is now checked by `/api/admin-login` on the server and is not bundled into the browser JavaScript. Do not put real values in `.env`, source files, or GitHub.

## What is enabled in the repository

- Content Security Policy and clickjacking protection headers in `vercel.json`.
- MIME sniffing, referrer, permissions, opener, and HSTS headers.
- Basic server-side login rate limiting for the Nabda admin endpoint.
- Timing-safe comparison for the admin email/password check.
- Environment files, keys, certificates, and Vercel metadata ignored by Git.
- Production dependency audit checked with `pnpm audit --prod`.

## Scope limitation

The project is a static frontend. Public frontend code and public assets can never be made impossible to copy. Real private data must be moved behind authenticated server/API endpoints; the current local demo bookings are browser-local and do not constitute a private database.
