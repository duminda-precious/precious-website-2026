// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO: set final domain once hosting is decided
export default defineConfig({
  site: 'https://precious.studio',
  output: 'static',
  // Clean URLs without a trailing slash (/about, /ai), matching the live site's /ai.
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    sitemap({
      // Dev pages (/dev/*) are never indexed.
      filter: (page) => !page.includes('/dev/'),
    }),
  ],
});
