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
      // Dev pages (/dev/*) and the hidden brand page (/brand) are never indexed.
      filter: (page) => !/\/(dev\/|brand(\/|$))/.test(page),
    }),
  ],
});
