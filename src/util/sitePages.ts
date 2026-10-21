/** Public pages on relun.chat (src/site) that the app links to. */
export const SitePages = {
  terms: '/terms/',
  privacy: '/privacy/',
  help: '/faq/',
} as const;

/** Opens a public page in a new tab, so the app keeps its place. */
export const openSitePage = (path: string) => {
  window.open(path, '_blank', 'noopener');
};
