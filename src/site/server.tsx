import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { renderHead } from './head';
import { Layout } from './Layout';
import { NOT_FOUND, PAGES, type SitePage } from './pages';

/**
 * Build-time renderer for the public pages, bundled by `vite build --ssr` and
 * run by scripts/prerender.mjs. Never shipped to browsers.
 */

export { PAGES };
export { SITE_URL } from './config';

const render = (page: SitePage, notFound: boolean) => ({
  head: renderHead(page, { notFound }),
  // Same tree as client.tsx hydrates, StrictMode included.
  html: renderToString(
    <StrictMode>
      <Layout path={page.path}>
        <page.Page />
      </Layout>
    </StrictMode>,
  ),
});

export const renderPage = (page: SitePage) => render(page, false);
export const renderNotFound = () => render(NOT_FOUND, true);
