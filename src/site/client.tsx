import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { initInstall, isStandalone } from '../util/install';
import { Layout } from './Layout';
import { isOldAppPath, pageFor } from './pages';
import { iconFontUrl } from './SiteIcon';
import './site.css';

/**
 * Browser entry for the public pages. In a build they arrive prerendered, so
 * this only hydrates them (the install button and waitlist need JavaScript);
 * the dev server sends an empty shell, so there it renders from scratch.
 */

// Same key as data/session.ts, read directly so this bundle stays free of the app.
const signedIn = () => {
  try {
    return !!JSON.parse(localStorage.getItem('relun.session') ?? 'null')?.accessToken;
  } catch {
    return false;
  }
};

const { pathname, search, hash } = window.location;

if (isOldAppPath(pathname)) {
  window.location.replace(`/app${pathname}${search}${hash}`);
} else if (pathname === '/' && (signedIn() || isStandalone())) {
  // Members and the installed app (older installs open at /) go straight into the app.
  window.location.replace('/app/');
} else {
  initInstall();
  const page = pageFor(pathname);
  const tree = (
    <StrictMode>
      <Layout path={page.path}>
        <page.Page />
      </Layout>
    </StrictMode>
  );
  const root = document.getElementById('root')!;

  // The dev server's root holds only the <!--site-html--> placeholder comment.
  if (root.firstElementChild) {
    hydrateRoot(root, tree);
  } else {
    document.title = page.title;
    const font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = iconFontUrl();
    document.head.appendChild(font);
    createRoot(root).render(tree);
  }
}
