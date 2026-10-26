# Changelog

Toutes les évolutions notables du site. Format : une section par version, la plus récente en haut.

## [0.1.0] — 2026-10-26 — version de validation

Première version, construite d'après le site WordPress actuel, les textes de Margaux Ricard (19/10/2026) et les retours de
Charles Bernardaud (31/07/2026).

### Ajouté
- 29 pages en français : accueil, offre (4 pages), matériaux (5), marchés (5), outil industriel, entreprise (historique,
  actionnariat, certifications et RSE, partenaires), contact, mentions légales, confidentialité, plan du site, erreur 404.
- 35 photos triées parmi les 265 médias de l'ancien site, optimisées en WebP (4,5 Mo), avec texte alternatif et crédits.
  Les photos de clients (Dior, Guerlain, etc.) et les visuels de projets sont volontairement écartés.
- Système de design (Sora + Inter auto-hébergées, fond porcelaine, accent terre cuite), menu accessible, version mobile.
- Aucun cookie, aucune ressource de tiers. En-têtes de sécurité et CSP stricte dans `public/.htaccess`.
- SEO : titres et descriptions par page, plan du site XML, `robots.txt`, données structurées (organisation, fil d'Ariane).
- Contrôle automatique `npm run verifier` (ressources externes, scripts en ligne, liens, titres).
- Aperçu de validation non indexable (`PUBLIC_MODE_APERCU=1`), déployable à la racine ou dans un sous-dossier.

### À faire avant la mise en ligne
Voir `docs/POINTS-A-VALIDER.md` : chiffres clés, coordonnées, mentions légales, visuels à fournir, plan OVH.
