# bernardaudsi-site — Avancement

> Réécrit par l'agent de développement en fin de session notable (5 à 15 lignes). Jarvis le relit pour sa mémoire. Aucun secret.

**Dernière mise à jour** : 2026-10-27

## État
Version de validation 0.1.2 poussée sur le dépôt GitHub, **public depuis le 2026-10-27** (29 pages, contrôle automatique sans erreur) ; pas encore d'aperçu en ligne ni de mise en ligne.

## Fait
- Projet Astro 7 statique, système de design Sora + Inter auto-hébergées (skill ui-ux-pro-max, copié dans `.claude/skills/`), menu accessible, version mobile.
- 29 pages en français d'après les textes de Margaux Ricard et les retours de Charles Bernardaud ; 27 photos triées sur 265, sans photos de clients ni assiettes.
- Revue indépendante du 2026-10-26 : 0 point critique ; photos, `.htaccess`, menu, plan du site, SEO et documentation corrigés (voir CHANGELOG 0.1.1).
- Aucun cookie, aucune ressource tierce ; `public/.htaccess` (CSP stricte, en-têtes, HTTPS) ; `npm run verifier`.
- Documentation : README, ARCHITECTURE, CONTENUS, SECURITE, DEPLOIEMENT, POINTS-A-VALIDER.
- Dépôt Bernardaud-IT/bernardaudsi-site créé privé et `main` poussé le 2026-10-27, puis **rendu public le même jour sur demande de Damien** (historique contrôlé : aucun secret). Secret scanning et push protection activés ; Dependabot actif ; pas de protection technique de `main` : plus de push direct, branche et pull request.

## Reste à faire
0. **Droits des photos, dépôt public** : les 27 photos de `src/assets/photos/` sont visibles de tous. Décider avec Charles et Alice de garder celles dont le droit est confirmé et de retirer les autres (ou de repasser le dépôt en privé) : B6, B8, B9 de `docs/POINTS-A-VALIDER.md`.
1. Aperçu de validation : **GitHub Pages** (workflow manuel `apercu.yml` prêt, public et en `noindex` ; Damien passe la source de Pages sur « GitHub Actions », puis lance le workflow une fois la PR fusionnée) et/ou sous-domaine OVH protégé par mot de passe (seule option confidentielle ; Damien le crée).
2. Arbitrages de contenu (`docs/POINTS-A-VALIDER.md`) : chiffres clés, surfaces, cordiérite et C120, coordonnées, légal, droit à l'image.
3. Plan OVH exact, essai des règles `.htaccess` sur l'hébergement, redirections des anciennes adresses, bascule.
4. Anglais, formulaire de contact, back-office : après la première mise en ligne.

## Décisions prises
- 2026-10-26 — Astro statique, hébergement OVH Web Cloud, zéro cookie, aucune ressource de tiers.
- 2026-10-26 — Chiffres clés masqués (`visible: false`) tant que Charles et Margaux n'ont pas tranché.
- 2026-10-26 — Node 22.23.4 requis (Astro 7) : mis à jour sur le poste de Damien.
- 2026-10-27 — Pas de GitHub Pages pour l'aperçu (décision de Damien) : un site Pages est public même pour un dépôt privé.
- 2026-10-27 — Dépôt rendu public (décision de Damien) ; la documentation du dépôt est corrigée en conséquence (README, CLAUDE.md, SECURITE.md).
- 2026-10-27 — Aperçu sur GitHub Pages voulu par Damien (revient sur la décision du matin, le dépôt étant public) : workflow manuel `apercu.yml`, mode aperçu `noindex`, contrôle bloquant si une page est indexable.
