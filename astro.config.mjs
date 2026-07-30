// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Force static HTML generation for maximum speed
  output: 'static',

  // Optimize for static builds
  build: {
    format: 'directory',
  },

  // No UI framework integration: the only client JS is Astro's ClientRouter
  vite: {
    plugins: [tailwindcss()],
  },

  // Configure trailing slashes for better static hosting
  trailingSlash: 'never',

  // Enable compression for static files
  compressHTML: true,

  // Set production site URL
  site: 'https://hamzatekin.dev',
});
