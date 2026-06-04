import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://jonashaeg.com',
  // Set base to the repo name for GitHub Pages subpath hosting.
  // When the custom domain jonashaeg.com is active, remove this line.
  base: '/websnewflow',
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
});
