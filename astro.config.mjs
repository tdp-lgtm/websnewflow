import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jonashaeg.com',
  integrations: [sitemap({
    filter: (page) => !page.includes('/theme'),
  })],
  // Only prefetch links explicitly opted in via data-astro-prefetch (the primary
  // nav). Avoids eagerly fetching every in-content link on metered mobile data,
  // while still making the main navigation feel instant.
  prefetch: { prefetchAll: false, defaultStrategy: 'viewport' },
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
});
