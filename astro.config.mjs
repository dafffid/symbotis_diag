import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/static';

// https://astro.build/config
export default defineConfig({
  // URL de production (GitHub Pages / domaine personnalisé).
  site: 'https://diagnostic.symbotis.com',
  // L'île React est hydratée côté client : une sortie statique suffit.
  output: 'static',
  // L'adaptateur Vercel n'est appliqué que dans l'environnement de build Vercel.
  // Sur GitHub Actions (Pages), on produit un build statique standard dans dist/.
  ...(process.env.VERCEL ? { adapter: vercel() } : {}),
  integrations: [react()],
});
