import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

// The dev server forwards API and socket traffic to the backend, so the app
// talks to its own origin. That keeps https pages (needed for location on a
// phone) from being blocked for calling an http API.
const api = 'http://localhost:9000';
const proxy = {
  '/api': { target: api, changeOrigin: true },
  '/socket.io': { target: api, changeOrigin: true, ws: true },
};

/**
 * Two pages: index.html is the public site (src/site, prerendered at build
 * time) and app.html is the app, served for every /app/* path. Production
 * hosting does the same with a rewrite (see README).
 */
const appFallback = (): Plugin => {
  const rewrite = (req: { url?: string; headers: { accept?: string } }, _res: unknown, next: () => void) => {
    const path = req.url?.split('?')[0] ?? '';
    const isPage = req.headers.accept?.includes('text/html');
    if (isPage && (path === '/app' || path.startsWith('/app/'))) req.url = '/app.html';
    next();
  };
  return {
    name: 'relun-app-fallback',
    configureServer: (server) => void server.middlewares.use(rewrite),
    configurePreviewServer: (server) => void server.middlewares.use(rewrite),
  };
};

export default defineConfig(({ mode, isSsrBuild }) => ({
  // `npm run dev:phone` serves https on your Wi-Fi with a self-signed certificate.
  plugins: [react(), appFallback(), ...(mode === 'phone' ? [basicSsl()] : [])],
  server: { port: 5173, proxy },
  preview: { proxy },
  // The SSR build (src/site/server.tsx, for prerendering) takes its entry from the command line.
  build: isSsrBuild ? {} : { rollupOptions: { input: { site: 'index.html', app: 'app.html' } } },
}));
