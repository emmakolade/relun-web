import { getApp } from '../data/store';
import { webPush } from './webPush';

/**
 * When to show our own "turn on notifications" card before the browser's
 * prompt. The browser prompt can only be shown from a tap and, once blocked,
 * never again, so we ask ourselves first, at a moment it obviously helps, and
 * back off: once a week at most, three times in all.
 */

/** prompt: we can ask the browser. blocked: the user blocked it. install: iPhone, needs the Home Screen app. */
export type PushAskMode = 'prompt' | 'blocked' | 'install';
export type PushAskReason = 'login' | 'match' | 'request' | 'date';

const KEY = 'relun.pushAsk';
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_ASKS = 3;

type Record = { count: number; last: number };

const read = (): Record => {
  try {
    return { count: 0, last: 0, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') };
  } catch {
    return { count: 0, last: 0 };
  }
};

/** What asking would mean in this browser right now, or null if there's nothing to ask. */
export const pushAskMode = (): PushAskMode | null => {
  if (webPush.needsInstall()) return 'install';
  if (!webPush.available()) return null;
  if (Notification.permission === 'default') return 'prompt';
  if (Notification.permission === 'denied') return 'blocked';
  return null;
};

/** Whether to show the card now. Never if they turned notifications off in Relun's own Settings. */
export const shouldAskForPush = (): PushAskMode | null => {
  if (!getApp().settings.notificationsEnabled) return null;
  const mode = pushAskMode();
  if (!mode) return null;
  const r = read();
  if (r.count >= MAX_ASKS || Date.now() - r.last < WEEK_MS) return null;
  return mode;
};

export const markPushAsked = () => {
  const r = read();
  try {
    localStorage.setItem(KEY, JSON.stringify({ count: r.count + 1, last: Date.now() }));
  } catch {
    // Storage blocked: the card may show again next visit.
  }
};
