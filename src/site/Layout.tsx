import type { ReactNode } from 'react';
import { RingsMark } from '../components/Brand';
import { Pacifico } from '../theme';
import { APP_PATH, COMPANY, CONTACT_EMAIL } from './config';
import { SiteIcon } from './SiteIcon';

const NAV = [
  { href: '/pricing/', label: 'Pricing' },
  { href: '/safety/', label: 'Safety' },
  { href: '/faq/', label: 'FAQ' },
];

const FOOTER = [
  {
    title: 'Relun',
    links: [
      { href: '/', label: 'Home' },
      { href: '/about/', label: 'About' },
      { href: '/pricing/', label: 'Pricing' },
      { href: APP_PATH, label: 'Open the web app' },
    ],
  },
  {
    title: 'Help',
    links: [
      { href: '/safety/', label: 'Dating safety' },
      { href: '/faq/', label: 'FAQ' },
      { href: `mailto:${CONTACT_EMAIL}`, label: 'Contact us' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/terms/', label: 'Terms of Service' },
      { href: '/privacy/', label: 'Privacy Policy' },
      { href: '/delete-account/', label: 'Delete your account' },
    ],
  },
];

export function Brand({ small = false }: { small?: boolean }) {
  return (
    <span className={small ? 'lp-brand lp-brand-sm' : 'lp-brand'}>
      <RingsMark width={small ? 26 : 34} />
      <span style={{ fontFamily: Pacifico }}>relun</span>
    </span>
  );
}

/** Header and footer around every public page. `path` marks the current nav link. */
export function Layout({ path, children }: { path: string; children: ReactNode }) {
  return (
    <div className="lp">
      <a className="lp-skip" href="#main">
        Skip to content
      </a>
      <header className="lp-bar">
        <div className="lp-wrap lp-bar-inner">
          <a href="/" aria-label="Relun home" className="press-plain">
            <Brand />
          </a>
          <nav className="lp-nav" aria-label="Main">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} aria-current={path === n.href ? 'page' : undefined}>
                {n.label}
              </a>
            ))}
            <a href={APP_PATH} className="lp-bar-cta press">
              Open Relun
              <SiteIcon name="arrow_forward" size={18} />
            </a>
          </nav>
        </div>
      </header>

      <main id="main">{children}</main>

      <footer className="lp-footer">
        <div className="lp-wrap">
          <div className="lp-footer-grid">
            <div className="lp-footer-about">
              <Brand small />
              <p>Meet people nearby who want the same thing you do.</p>
            </div>
            {FOOTER.map((col) => (
              <nav key={col.title} aria-label={col.title} className="lp-footer-col">
                <h2>{col.title}</h2>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <a href={l.href}>{l.label}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
          <div className="lp-footer-base">
            <span>
              © {new Date().getFullYear()} {COMPANY}. All rights reserved.
            </span>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/** Title block for the text pages (pricing, safety, legal...). */
export function PageHead({ kicker, title, children }: { kicker?: string; title: string; children?: ReactNode }) {
  return (
    <section className="lp-pagehead">
      <div className="lp-wrap">
        {kicker && <span className="lp-kicker">{kicker}</span>}
        <h1>{title}</h1>
        {children && <p>{children}</p>}
      </div>
    </section>
  );
}
