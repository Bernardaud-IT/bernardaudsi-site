# Changelog

Toutes les évolutions notables du site. Format : une section par version, la plus récente en haut.

## [0.1.2] — 2026-10-27 — premier dépôt GitHub

### Modifié
- Retrait du workflow GitHub Pages (`apercu.yml`) : décision de Damien, un site Pages est public même pour un dépôt privé. L'aperçu de
  validation se fait sur un sous-domaine OVH protégé par mot de passe (`docs/DEPLOIEMENT.md`).

## [0.1.1] — 2026-10-26 — corrections après revue indépendante

Une relecture indépendante (sécurité, fidélité au texte de Margaux, accessibilité, référencement) a conduit à :

### Corrigé
- **Photos** : 8 photos retirées (textes alternatifs faux pour « caractérisation » et « prototypage » ; assiettes ou visage de salarié en gros plan, contraires à la consigne de Charles ; doublons). 27 photos restent, réaffectées ; l'accueil et l'offre n'ont plus d'assiettes.
- **Coordonnées** : téléphone et courriel provisoires retirés du pied de page tant que `aConfirmer` vaut `true` (ils restent sur la page Contact, avec avertissement).
- **Plan du site** : les deux pages légales en brouillon (`noindex`) n'y figurent plus.
- **`.htaccess`** : redirection `www.bernardaudsi.com` vers `bernardaudsi.com` ; HSTS prévu sans `includeSubDomains` et en démarrant à 1 jour ; `Options -Indexes` retiré (risque d'erreur 500 sur le mutualisé) ; `data:` retiré de la CSP ; compression JavaScript.
- **Menu** : Échap ferme réellement les sous-menus ouverts au survol ou au clavier, `aria-expanded` suit l'état réel, le menu mobile rend le reste de la page inerte (le focus ne peut plus en sortir).
- **Accessibilité** : mots anglais balisés `lang="en"` (syntaxe `[en]…[/en]` dans les contenus).
- **SEO** : titres de 70 caractères au plus et descriptions de 160 au plus ; page 404 sans adresse canonique ; `robots.txt` tient compte de `SITE_BASE`.
- **Contrôle** : `npm run verifier` analyse aussi les fichiers CSS et JavaScript et refuse iframe, object, embed, video, audio, form et redirection meta ; la documentation décrit désormais précisément ce qu'il couvre.
- **Contenu** : la description de « Décoration et traitements de surface » reprend « notamment par PVD » comme dans le texte de Margaux.

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
