import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jonashaeg.com',
  integrations: [sitemap({
    filter: (page) => !page.includes('/theme'),
  })],
  // Prefetch links as they scroll into view — makes first taps on mobile
  // (no hover) feel as fast as desktop
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
});
