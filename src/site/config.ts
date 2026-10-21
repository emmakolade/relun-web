/**
 * Facts the public pages (relun.chat, outside /app) share. Prices mirror
 * relun-backend/src/config/coins.ts and the PLUS_* values in its .env; change
 * them here too when those change.
 */

export const SITE_URL = 'https://relun.chat';
export const APP_PATH = '/app/';
export const CONTACT_EMAIL = 'hello@relun.chat';
/** The registered company name, as it appears in the legal pages and footer. */
export const COMPANY = 'Relun';
/** The date the Terms and Privacy Policy last changed, shown on both. */
export const LEGAL_UPDATED = '20 October 2026';
export const DELETION_DAYS = 30;

export const PRICES = {
  plusWeekly: 1200,
  plusMonthly: 2500,
  freeDailyLikes: 15,
  freeWeeklyRequests: 1,
  plusMonthlyRequests: 5,
  messageRequestCoins: 200,
  freeActiveDates: 1,
  plusActiveDates: 3,
  datePostCoins: 100,
  signupCoins: 300,
  coinPacks: [
    { coins: 500, naira: 1000 },
    { coins: 1000, naira: 2000 },
    { coins: 2500, naira: 4500 },
    { coins: 6000, naira: 9000 },
  ],
} as const;

export const naira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;

/** The API for the waitlist form; same rule as the app's data/network.ts. */
export const apiUrl = (path: string) => {
  const raw = (import.meta.env.VITE_API_BASE_URL as string | undefined) || '/';
  return `${raw.endsWith('/') ? raw : `${raw}/`}${path.replace(/^\//, '')}`;
};
