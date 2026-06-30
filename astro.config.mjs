import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/static';

// https://astro.build/config
export default defineConfig({
  // L'île React est hydratée côté client : une sortie statique suffit.
  output: 'static',
  adapter: vercel(),
  integrations: [react()],
});
