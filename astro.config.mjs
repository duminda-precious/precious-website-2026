// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO: set final domain once hosting is decided
export default defineConfig({
  site: 'https://precious.studio',
  output: 'static',
  integrations: [
    sitemap({
      // Dev pages (/dev/*) are never indexed.
      filter: (page) => !page.includes('/dev/'),
    }),
  ],
});
