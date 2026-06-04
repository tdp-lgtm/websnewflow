import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://jonashaeg.com',
  base: '/websnewflow',
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
});
