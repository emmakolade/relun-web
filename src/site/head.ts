import { APP_PATH, CONTACT_EMAIL, PRICES, SITE_URL } from './config';
import type { SitePage } from './pages';
import { FAQS } from './pages/Faq';
import { iconFontUrl } from './SiteIcon';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// JSON-LD sits in a <script>; "</" must not close it early.
const ld = (data: object) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

const OG_IMAGE = `${SITE_URL}/og-image.png`;

const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Relun',
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/icons/icon-512.png`,
  email: CONTACT_EMAIL,
};

const offer = (name: string, price: number) => ({ '@type': 'Offer', name, price, priceCurrency: 'NGN' });

const webApplication = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Relun',
  url: `${SITE_URL}${APP_PATH}`,
  applicationCategory: 'LifestyleApplication',
  applicationSubCategory: 'Dating',
  operatingSystem: 'Any (web browser)',
  browserRequirements: 'Requires JavaScript',
  description: 'A dating app for anyone: meet people nearby who want the same thing you do.',
  offers: [
    offer('Free', 0),
    offer('Relun Plus, weekly', PRICES.plusWeekly),
    offer('Relun Plus, monthly', PRICES.plusMonthly),
  ],
};

const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Relun',
  url: `${SITE_URL}/`,
  inLanguage: 'en',
};

const faqPage = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

const breadcrumbs = (page: SitePage) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Relun', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: page.crumb, item: `${SITE_URL}${page.path}` },
  ],
});

/** Everything page-specific in <head>: replaces <!--site-head--> in index.html. */
export function renderHead(page: SitePage, { notFound = false } = {}): string {
  const url = `${SITE_URL}${page.path}`;
  const tags = [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
    notFound ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Relun" />`,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Relun: find your match, your way" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(page.title)}" />`,
    `<meta name="twitter:description" content="${esc(page.description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
    `<link rel="stylesheet" href="${esc(iconFontUrl())}" />`,
  ];

  if (!notFound) {
    if (page.path === '/') tags.push(ld(organization), ld(website), ld(webApplication));
    if (page.path === '/pricing/') tags.push(ld(webApplication));
    if (page.path === '/faq/') tags.push(ld(faqPage));
    if (page.crumb) tags.push(ld(breadcrumbs(page)));
  }

  return tags.join('\n    ');
}
