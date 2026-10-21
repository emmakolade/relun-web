import type { ComponentType } from 'react';
import { About } from './pages/About';
import { DeleteAccount } from './pages/DeleteAccount';
import { Faq } from './pages/Faq';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { Pricing } from './pages/Pricing';
import { Privacy } from './pages/Privacy';
import { Safety } from './pages/Safety';
import { Terms } from './pages/Terms';

export type SitePage = {
  /** With a trailing slash, which is how the static host serves page/index.html. */
  path: string;
  title: string;
  description: string;
  Page: ComponentType;
  /** Shown in breadcrumbs structured data; the home page has none. */
  crumb?: string;
  /** sitemap.xml priority, 0 to 1. */
  priority: number;
};

/** Every public page. scripts/prerender.mjs writes each to dist/<path>/index.html. */
export const PAGES: SitePage[] = [
  {
    path: '/',
    title: 'Relun: Dating App to Meet People Nearby | Relationship or Fun',
    description:
      "Relun is a free dating app. Meet people nearby who want the same thing you do, something serious or just fun. Works in your phone's browser today.",
    Page: Home,
    priority: 1,
  },
  {
    path: '/pricing/',
    title: 'Pricing: Relun Plus from ₦1,200 a Week | Relun',
    description:
      'Matching and chatting on Relun are free. Relun Plus adds unlimited likes and shows who liked you, from ₦1,200 a week or ₦2,500 a month.',
    Page: Pricing,
    crumb: 'Pricing',
    priority: 0.8,
  },
  {
    path: '/safety/',
    title: 'Online Dating Safety Tips | Relun',
    description:
      'How to spot a romance scam, what to do before a first date, and how to stay safe when you meet someone from a dating app.',
    Page: Safety,
    crumb: 'Safety',
    priority: 0.8,
  },
  {
    path: '/faq/',
    title: 'FAQ: How Relun Works | Relun',
    description:
      'Answers to common questions about Relun: is it free, how matching works, Relun Plus, coins, safety, and when the Android and iPhone apps arrive.',
    Page: Faq,
    crumb: 'FAQ',
    priority: 0.7,
  },
  {
    path: '/about/',
    title: 'About Relun | Dating Without the Guesswork',
    description:
      'Relun is a dating app where you choose Relationship or Fun and only meet people who chose the same. Free chat with every match.',
    Page: About,
    crumb: 'About',
    priority: 0.6,
  },
  {
    path: '/terms/',
    title: 'Terms of Service | Relun',
    description: 'The terms that apply when you use Relun, including community rules, Relun Plus and coins.',
    Page: Terms,
    crumb: 'Terms of Service',
    priority: 0.3,
  },
  {
    path: '/privacy/',
    title: 'Privacy Policy | Relun',
    description:
      'What personal data Relun collects, how we use and protect it, and the rights you have over it.',
    Page: Privacy,
    crumb: 'Privacy Policy',
    priority: 0.3,
  },
  {
    path: '/delete-account/',
    title: 'Delete Your Relun Account | Relun',
    description: 'How to delete your Relun account in the app or by email, and what happens to your data when you do.',
    Page: DeleteAccount,
    crumb: 'Delete your account',
    priority: 0.3,
  },
];

export const NOT_FOUND: SitePage = {
  path: '/404/',
  title: 'Page Not Found | Relun',
  description: 'That page doesn’t exist or has moved.',
  Page: NotFound,
  priority: 0,
};

/** "/pricing" and "/pricing/index.html" both mean "/pricing/". */
export const normalizePath = (pathname: string): string => {
  let p = pathname.replace(/index\.html$/, '');
  if (!p.endsWith('/')) p += '/';
  return p;
};

export const pageFor = (pathname: string): SitePage => PAGES.find((p) => p.path === normalizePath(pathname)) ?? NOT_FOUND;

/**
 * Paths the app used before it moved under /app/. Links to them (old emails,
 * bookmarks, the installed app) are sent on to the same screen under /app/.
 */
const OLD_APP_PATHS = /^\/(code|chat|person)\/|^\/(notifications|settings|blocked|edit-profile|views|details|location|photos|youre-in)\/?$/;

export const isOldAppPath = (pathname: string) => OLD_APP_PATHS.test(pathname);
