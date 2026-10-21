import * as Sentry from '@sentry/react';
import { scrubUrl } from './analytics';

/**
 * Error reporting (Sentry). Off unless VITE_SENTRY_DSN is set. No replay, no
 * default PII, no auth headers, no auth request bodies, and profile and chat
 * URLs don't say who the other person is.
 */

const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;

const isAuthCall = (url: unknown) => typeof url === 'string' && url.includes('api/auth/');

export function initMonitoring() {
  if (!dsn) return;
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    // The v11 replacement for sendDefaultPii: false. Its defaults collect bodies, headers and query params.
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: { request: { deny: ['authorization', 'cookie'] }, response: false },
      httpBodies: [],
      urlQueryParams: false,
    },
    tracesSampleRate: 0.2,
    integrations: [Sentry.browserTracingIntegration()],
    beforeSend(event) {
      const req = event.request;
      if (req) {
        if (req.headers) {
          for (const h of Object.keys(req.headers)) if (h.toLowerCase() === 'authorization') delete req.headers[h];
        }
        if (isAuthCall(req.url)) delete req.data;
        delete req.cookies;
        if (req.url) req.url = scrubUrl(req.url);
      }
      return event;
    },
    beforeSendTransaction(event) {
      if (event.transaction) event.transaction = scrubUrl(event.transaction);
      if (event.request?.url) event.request.url = scrubUrl(event.request.url);
      return event;
    },
    beforeBreadcrumb(crumb) {
      const data = crumb.data;
      if (data) {
        delete data.headers;
        delete data.request_headers;
        if (isAuthCall(data.url)) {
          delete data.body;
          delete data.request_body;
        }
        for (const k of ['url', 'from', 'to']) if (typeof data[k] === 'string') data[k] = scrubUrl(data[k]);
      }
      return crumb;
    },
  });
}

/** Errors carry the user's id only; null clears it on sign-out. */
export function setMonitoringUser(userId: string | null) {
  if (dsn) Sentry.setUser(userId ? { id: userId } : null);
}

export const reactErrorHandler = Sentry.reactErrorHandler;
