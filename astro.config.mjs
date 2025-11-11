// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  // Force static HTML generation for maximum speed
  output: 'static',

  // Optimize for static builds
  build: {
    format: 'directory'
  },

  // Disable client-side JavaScript for pure HTML output
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
