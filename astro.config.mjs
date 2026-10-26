// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Site statique : `npm run build` produit le dossier dist/, déposé tel quel sur l'hébergement.
// Aucun serveur d'application ne tourne en ligne, donc très peu de surface d'attaque.
//
// Variables d'environnement facultatives, utilisées seulement pour les aperçus de validation :
//   SITE_URL  adresse publique de l'aperçu (par défaut : https://bernardaudsi.com)
//   SITE_BASE dossier de publication (par défaut : /, ex. /bernardaudsi-site/ sur GitHub Pages)
//   PUBLIC_MODE_APERCU=1  interdit l'indexation (meta robots et robots.txt)
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://bernardaudsi.com',
  base: process.env.SITE_BASE ?? '/',
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  devToolbar: { enabled: false },
  build: {
    format: 'directory',
    // Aucun style ni script « en ligne » : la politique de sécurité (CSP) du .htaccess
    // peut alors interdire 'unsafe-inline' et bloquer toute injection de code.
    inlineStylesheets: 'never',
  },
  vite: {
    build: { assetsInlineLimit: 0 },
  },
  integrations: [
    sitemap({
      // La page d'erreur 404 n'a pas à figurer dans le plan du site.
      filter: (page) => !page.includes('/404'),
    }),
  ],
});
