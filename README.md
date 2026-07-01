# Symbotis - Diagnostic Maturité Digitale

Site vitrine **Symbotis** (conseil en transformation digitale par l’IA), construit
avec [Astro](https://astro.build). La page phare est un **diagnostic de maturité
digitale** interactif, intégré comme **île React** hydratée côté client.

## Stack

| | |
|---|---|
| Framework | Astro 5 (sortie **statique**) |
| Interactivité | Île React 18 (`client:load`) — `src/components/DiagnosticMaturite.jsx` |
| PDF | [jsPDF](https://github.com/parallax/jsPDF) (génération client-side, sans serveur) |
| Icônes | Tabler Icons (diagnostic) + Font Awesome 6.4 (chrome) — via CDN jsDelivr |
| Police | Inter 300–800 (Google Fonts) |
| Déploiement | Vercel (`@astrojs/vercel/static`) |

## Structure

```
src/
├─ layouts/Base.astro                       # <head>, nav navy sticky, footer navy
├─ pages/
│  ├─ index.astro                           # accueil à la marque
│  └─ diagnostic-maturite-digitale.astro    # page diagnostic (île React)
├─ components/DiagnosticMaturite.jsx         # le diagnostic (composant React)
└─ styles/brand.css                         # tokens de marque Symbotis + variables du composant
```

> Les fichiers `diagnostic_maturite_*.html` / `.jsx` à la racine sont les **sources
> d’origine** conservées pour référence ; ils ne sont pas utilisés par le build.

## Commandes

```bash
npm install        # installer les dépendances
npm run dev        # serveur de dev → http://localhost:4321
npm run build      # build de production (dist/ + .vercel/output/)
npm run preview    # prévisualiser le build localement
```

## Identité de marque

Toutes les couleurs, ombres et primitives sont centralisées en variables CSS dans
`src/styles/brand.css` (navy `#1F2A63`, orange `#F39448`, orange CTA `#EA580C`,
amber, succès, échelle slate). Le composant React consomme ces mêmes variables —
modifier la marque se fait à un seul endroit.

## Déploiement sur Vercel

Le projet est déjà configuré avec l’adaptateur Vercel en sortie statique
(`astro.config.mjs`). Pour relier le dépôt :

### Option A — via le tableau de bord Vercel (recommandé)

1. Poussez ce dépôt sur GitHub / GitLab / Bitbucket.
2. Sur [vercel.com/new](https://vercel.com/new), importez le dépôt.
3. Vercel détecte Astro automatiquement :
   - **Build Command** : `npm run build`
   - **Output Directory** : laissé géré par l’adaptateur (`.vercel/output`)
4. Cliquez sur **Deploy**. Chaque push génère ensuite une preview, et la branche de
   production est déployée sur le domaine.

### Option B — via la CLI

```bash
npm i -g vercel
vercel        # première fois : lie le projet (preview)
vercel --prod # déploiement en production
```

Aucune variable d’environnement n’est requise : le diagnostic et la génération de
PDF tournent entièrement côté client.
