import posthog, { type CaptureResult } from 'posthog-js';

/**
 * Product analytics (PostHog). Off unless VITE_POSTHOG_KEY is set, and then
 * only the explicit events below plus pageviews: no autocapture and no session
 * recording, so chat text, names and bios never leave the page. Event names
 * match the Android app.
 */

export type AnalyticsEvent =
  | 'signed_up'
  | 'signed_in'
  | 'profile_completed'
  | 'like_sent'
  | 'match_created'
  | 'message_sent'
  | 'plus_purchased'
  | 'coins_purchased';

const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
let enabled = false;

/** Hides whose profile or chat is open and drops query strings (Paystack references and the like). */
export const scrubUrl = (url: string) =>
  url.split(/[?#]/)[0].replace(/\/(person|chat)\/[^/]+/g, '/$1/:userId');

const URL_PROPS = ['$current_url', '$pathname', '$referrer', '$initial_current_url', '$initial_pathname', '$initial_referrer'];

const scrub = (event: CaptureResult | null) => {
  if (!event) return event;
  for (const bag of [event.properties, event.$set, event.$set_once]) {
    if (!bag) continue;
    for (const prop of URL_PROPS) if (typeof bag[prop] === 'string') bag[prop] = scrubUrl(bag[prop]);
  }
  return event;
};

export function initAnalytics() {
  if (!key || enabled) return;
  posthog.init(key, {
    api_host: (import.meta.env.VITE_POSTHOG_HOST as string | undefined) || 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: 'history_change',
    autocapture: false,
    rageclick: false,
    capture_dead_clicks: false,
    capture_heatmaps: false,
    capture_exceptions: false, // Sentry has errors.
    disable_session_recording: true,
    disable_surveys: true,
    mask_all_text: true,
    mask_all_element_attributes: true,
    before_send: scrub,
  });
  enabled = true;
}

export function track(event: AnalyticsEvent, props?: Record<string, string | number | boolean>) {
  if (enabled) posthog.capture(event, props);
}

let identified: string | null = null;

/** The signed-in user's id only, never contact details. Null on sign-out or deletion resets the device. */
export function identify(userId: string | null) {
  if (!enabled || userId === identified) return;
  if (userId) posthog.identify(userId);
  else posthog.reset();
  identified = userId;
}
