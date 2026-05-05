import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://docs.astro.build/en/reference/configuration-reference/
// output: 'server' is required by @astrojs/cloudflare (staticOutput: "unsupported").
// Phase 1 pages opt-in to static rendering via `export const prerender = true`.
// SSR routes (Phase 2 Workers endpoints) can opt out of prerendering per-page.
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
});
