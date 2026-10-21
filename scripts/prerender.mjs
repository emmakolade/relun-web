// Writes the public pages (src/site) as static HTML into dist/, after
// `vite build` (browser bundles) and `vite build --ssr` (the renderer in
// dist-ssr/). Each page goes to dist/<path>/index.html, unknown paths get
// dist/404.html, and sitemap.xml lists every page. The app keeps dist/app.html.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const { PAGES, SITE_URL, renderPage, renderNotFound } = await import(pathToFileURL(path.join(ssrDir, 'server.js')).href);

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
if (!template.includes('<!--site-head-->') || !template.includes('<!--site-html-->')) {
  throw new Error('dist/index.html is missing the <!--site-head--> or <!--site-html--> placeholder');
}

// Function replacers: page HTML can contain "$&"-style sequences that string replacements would expand.
const fill = ({ head, html }) => template.replace('<!--site-head-->', () => head).replace('<!--site-html-->', () => html);

for (const page of PAGES) {
  const file = path.join(dist, ...page.path.split('/').filter(Boolean), 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, fill(renderPage(page)));
  console.log(`prerendered ${page.path}`);
}

fs.writeFileSync(path.join(dist, '404.html'), fill(renderNotFound()));
console.log('prerendered 404.html');

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map(
  (p) => `  <url>
    <loc>${SITE_URL}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <priority>${p.priority.toFixed(1)}</priority>
  </url>`,
).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap);
console.log('wrote sitemap.xml');

fs.rmSync(ssrDir, { recursive: true, force: true });
