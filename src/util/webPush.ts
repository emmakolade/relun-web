import { api } from '../data/network';
import { isIos, isStandalone } from './install';

/**
 * Browser push through Firebase Cloud Messaging, the same service that pushes
 * to the Android app, so the backend sends to both the same way. Pushes land
 * in public/sw.js, which shows them and opens the right screen on tap.
 *
 * Needs the VITE_FIREBASE_* settings (see .env.example). Without them this is
 * a no-op and the app works as before.
 */

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};
const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined;

const configured = !!(config.apiKey && config.projectId && config.messagingSenderId && config.appId && vapidKey);

// The token this browser registered, so signing out can remove it.
const TOKEN_KEY = 'relun.webPushToken';

const readToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};
const writeToken = (token: string | null) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Storage blocked: signing out just can't remove this browser's token.
  }
};

const browserSupportsPush = () => 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

const messaging = async () => {
  const [{ initializeApp, getApps }, m] = await Promise.all([import('firebase/app'), import('firebase/messaging')]);
  if (!(await m.isSupported())) return null;
  const app = getApps()[0] ?? initializeApp(config);
  return { m, instance: m.getMessaging(app) };
};

/** Gets this browser's token and tells the backend. Needs permission already granted. */
const register = async (): Promise<boolean> => {
  const fcm = await messaging();
  if (!fcm) return false;
  const registration = await navigator.serviceWorker.register('/sw.js');
  const token = await fcm.m.getToken(fcm.instance, { vapidKey, serviceWorkerRegistration: registration });
  if (!token) return false;
  if (token !== readToken()) {
    await api.registerPushToken(token);
    writeToken(token);
  }
  return true;
};

export type WebPushResult = 'on' | 'denied' | 'unavailable';

export const webPush = {
  /** Whether this browser can get pushes at all (and the app is set up for it). */
  available: () => configured && browserSupportsPush(),

  /** iPhones only allow web push once Relun is installed to the home screen. */
  needsInstall: () => isIos() && !isStandalone(),

  /** Asks for permission if needed, then registers. Call from a tap: browsers block prompts otherwise. */
  async enable(): Promise<WebPushResult> {
    if (!webPush.available()) return 'unavailable';
    const permission = Notification.permission === 'default' ? await Notification.requestPermission() : Notification.permission;
    if (permission !== 'granted') return 'denied';
    try {
      return (await register()) ? 'on' : 'unavailable';
    } catch (e) {
      console.warn('[push] Could not turn on web push', e);
      return 'unavailable';
    }
  },

  /** On each visit: keeps the token fresh if permission was given earlier. Never prompts. */
  async sync() {
    if (!webPush.available() || Notification.permission !== 'granted') return;
    await register().catch((e) => console.warn('[push] Could not refresh web push', e));
  },

  /** On sign-out: this browser stops getting the account's pushes. */
  async unregister() {
    const token = readToken();
    writeToken(null);
    if (!token) return;
    await api.unregisterPushToken(token).catch(() => {});
    if (!webPush.available()) return;
    const fcm = await messaging().catch(() => null);
    if (fcm) await fcm.m.deleteToken(fcm.instance).catch(() => {});
  },
};
