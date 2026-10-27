# bernardaudsi-site — Avancement

> Réécrit par l'agent de développement en fin de session notable (5 à 15 lignes). Jarvis le relit pour sa mémoire. Aucun secret.

**Dernière mise à jour** : 2026-10-26

## État
Version de validation 0.1.0 construite et testée en local (29 pages, contrôle automatique sans erreur) ; pas encore de dépôt GitHub ni de mise en ligne.

## Fait
- Projet Astro 7 statique, système de design Sora + Inter auto-hébergées (skill ui-ux-pro-max), menu accessible, version mobile.
- 29 pages en français d'après les textes de Margaux Ricard et les retours de Charles Bernardaud ; 27 photos triées sur 265, sans photos de clients ni assiettes.
- Revue indépendante du 2026-10-26 : 0 point critique ; photos, `.htaccess`, menu, plan du site, SEO et documentation corrigés (voir CHANGELOG 0.1.1).
- Aucun cookie, aucune ressource tierce ; `public/.htaccess` (CSP stricte, en-têtes, HTTPS) ; `npm run verifier`.
- Documentation : README, ARCHITECTURE, CONTENUS, SECURITE, DEPLOIEMENT, POINTS-A-VALIDER.

## Reste à faire
1. Dépôt privé Bernardaud-IT/bernardaudsi-site et premier push (confirmation de Damien).
2. Aperçu de validation sur un sous-domaine OVH protégé par mot de passe (Damien le crée). **Pas de GitHub Pages** (public même pour un dépôt privé).
3. Arbitrages de contenu (`docs/POINTS-A-VALIDER.md`) : chiffres clés, surfaces, cordiérite et C120, coordonnées, légal.
4. Plan OVH exact, essai des règles `.htaccess` sur l'hébergement, bascule.
5. Anglais, formulaire de contact, back-office : après la première mise en ligne.

## Décisions prises
- 2026-10-26 — Astro statique, hébergement OVH Web Cloud, zéro cookie, aucune ressource de tiers.
- 2026-10-26 — Chiffres clés masqués (`visible: false`) tant que Charles et Margaux n'ont pas tranché.
- 2026-10-26 — Node 22.23.4 requis (Astro 7) : mis à jour sur le poste de Damien.
