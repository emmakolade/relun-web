# Relun for the web

React + Vite + TypeScript copy of the Android app (`relun-android/`). It talks to the same `relun-backend` (REST + Socket.IO).

The UI matches Android screen for screen. On a desktop browser it renders as a phone-width column centred on the page. **Any UI or UX change made to relun-android must be made here too.**

## Run it

1. Start the backend (`relun-backend`, `npm run dev`, port 9000).
2. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` if the API isn't on `http://localhost:9000/`.
3. `npm install`, then `npm run dev` and open http://localhost:5173.

In development the app calls its own origin, and Vite forwards `/api` and `/socket.io` to the backend on port 9000.

**On a phone (same Wi-Fi):** run `npm run dev:phone` and open `https://<your-pc-ip>:5173`. Accept the certificate warning; the certificate is self-signed. You need https because browsers only allow location access on secure pages. Windows Firewall must allow port 5173 on your network.

## Public site and app

relun.chat has two parts, built from this one project:

- **The public site** (`src/site/`, entry `index.html`): home, pricing, safety, FAQ, about, terms, privacy and delete-account pages. These are what search engines index. `npm run build` prerenders each one to static HTML (`dist/<page>/index.html`, plus `dist/404.html` and `dist/sitemap.xml`), and the browser then hydrates it. This part doesn't load the app's code, Firebase or socket.io.
- **The app** (entry `app.html`, `src/main.tsx`): everything under `/app/`. Its routes are unchanged inside (`/chat/:userId` is served at `/app/chat/:userId`). It is marked `noindex`.

To add a public page, add a component in `src/site/pages/` and an entry in `src/site/pages.ts`. Any new icon also goes in the `SITE_ICONS` list in `src/site/SiteIcon.tsx`. Prices shown on the site live in `src/site/config.ts`; keep them in step with the backend `.env`.

In dev, `npm run dev` serves both: `/` and the public pages render in the browser, and `/app/*` serves the app.

### Hosting (AWS Amplify)

`npm run build` writes everything to `dist/`. In the Amplify console:

1. **Rewrites and redirects:** paste `amplify-redirects.json`. It sends the app's old paths (from before it moved under `/app/`) to their new place, serves `app.html` for `/app/*`, and returns `404.html` with a real 404 for anything else. Don't add a catch-all SPA rule that serves `index.html`.
2. **Custom domain:** add `relun.chat` and redirect `www.relun.chat` to it.
3. The `amplifyapp.com` address serves the same files. Every page's canonical link points to relun.chat, so search engines treat relun.chat as the real one.
4. After launch, add relun.chat to Google Search Console and submit `https://relun.chat/sitemap.xml`.

## Coin purchases (Paystack)

Android sells coins through Google Play; the web uses Paystack.

1. On the backend, set `PAYSTACK_SECRET_KEY` (and optionally `PAYSTACK_CURRENCY` and the `PAYSTACK_PRICE_COINS_*` prices in kobo; see `relun-backend/.env.example`).
2. In the Paystack dashboard, set the webhook URL to `https://<api-host>/api/coins/paystack/webhook`.

The flow works like this. The backend creates the transaction (it sets the amount, so the client can't change it), the app opens the Paystack popup, and coins are credited after the backend verifies the charge with Paystack. The webhook credits the coins if the tab closes before that happens. Either path credits a purchase only once.

## Errors and analytics (Sentry, PostHog)

Both are off unless their keys are set in `.env` at build time:

- `VITE_SENTRY_DSN`: errors from the app (`src/util/monitoring.ts`). No session replay, no default PII; auth headers and auth request bodies are stripped, and users are tagged by id only.
- `VITE_POSTHOG_KEY` (and optionally `VITE_POSTHOG_HOST`, default `https://us.i.posthog.com`): pageviews plus the explicit events in `src/util/analytics.ts` (`signed_up`, `signed_in`, `profile_completed`, `like_sent`, `match_created`, `message_sent`, `plus_purchased` (with `source` when a prompt led to it), `plus_upsell_tapped`, `coins_purchased`; same names as Android). No autocapture or session recording. Event properties never carry names, contact details or message text. The public site sends pageviews only.

## Not on the web (yet)

- Push notifications. Real-time messages arrive over Socket.IO while the tab is open.

## Layout

```
src/data/        DTOs, models, fetch client with token refresh, Socket.IO, repositories, app store
src/navigation/  Stack (slide transitions), shell (MainViewModel), MainFlow, AppActions
src/components/  Buttons, inputs, visuals, controls (sheets, dialogs, toasts, rows)
src/screens/     auth, onboarding, discover, profile, match, messages, chat, dates, me, settings, sheets
src/site/        the public pages at relun.chat (web only; no Android counterpart)
src/theme.ts     Colours, segment accents, type scale (same values as Android ui/theme)
```

Android `foo/BarScreen.kt` maps to web `src/screens/foo/BarScreen.tsx`, and view models become hooks or stores in the same folder.
