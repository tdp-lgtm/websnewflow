import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.jonashaeg.com',
  integrations: [sitemap({
    filter: (page) => !page.includes('/theme'),
  })],
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
});
