import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://jonashaeg.com',
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
});
