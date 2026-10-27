# Architecture

## En une phrase

Un site **statique** : Astro lit les fichiers de contenu et les photos, fabrique toutes les pages en HTML une seule fois
(`npm run build`), et le résultat (`dist/`) est copié sur l'hébergement. Rien ne s'exécute en ligne.

## Choix techniques

| Choix | Pourquoi |
|---|---|
| Astro 7, génération statique | Pages rapides (bon pour le référencement), surface d'attaque minimale : pas de connexion, pas de base de données, pas de plugin à mettre à jour. |
| Contenu en fichiers JSON | Les textes sont séparés du code : on peut les modifier sans développeur et brancher plus tard un back-office ou la traduction. |
| CSS maison (`src/styles/global.css`) | Un seul fichier, des variables de couleur en tête ; aucune bibliothèque. |
| Polices auto-hébergées (Sora, Inter) | Aucune requête vers Google : vie privée (RGPD) et CSP stricte. |
| Photos optimisées au build | `scripts/images/prepare.mjs` réduit les originaux ; Astro génère ensuite plusieurs tailles et le format WebP. |
| Hébergement OVH Web Cloud | Contrainte posée par Damien. Des fichiers statiques et un `.htaccess` y suffisent. |

## Arborescence

```
bernardaudsi-site/
├─ astro.config.mjs            configuration (site, CSP-compatible : aucun style ni script en ligne)
├─ package.json                commandes : dev, build, preview, images, verifier
├─ public/                     copié tel quel dans dist/
│  ├─ .htaccess                en-têtes de sécurité, HTTPS, cache (OVH / Apache)
│  ├─ favicon.svg, og-default.jpg, js-flag.js
├─ src/
│  ├─ content/
│  │  ├─ site.json             nom, coordonnées, menu, liens du pied de page
│  │  ├─ images.json           photos retenues : nom, numéro de média, texte alternatif, crédit
│  │  └─ fr/                   UN FICHIER JSON PAR PAGE (accueil, offre/, materiaux/, marches/, entreprise/, ...)
│  ├─ assets/photos/           photos optimisées (générées par `npm run images`)
│  ├─ components/              Header, Footer, PageHero, Photo, Blocs et blocs/ (un composant par type de bloc)
│  ├─ layouts/Base.astro       structure commune : <head>, SEO, menu, pied de page
│  ├─ lib/                     site.ts (pages, liens), images.ts (photos)
│  ├─ pages/                   index.astro (accueil), [...slug].astro (toutes les autres pages), 404, plan-du-site, robots.txt
│  ├─ scripts/menu.ts          menu mobile et sous-menus
│  └─ styles/global.css        charte graphique
├─ scripts/
│  ├─ images/prepare.mjs       prépare les photos
│  └─ verify-site.mjs          contrôle de dist/
├─ design-system/              système de design (ui-ux-pro-max) et ses adaptations
├─ docs/                       cette documentation
├─ .claude/agents/             agents de développement du projet
└─ data-migration/             originaux de l'ancien site (HORS GIT)
```

## Comment une page est fabriquée

1. `src/lib/site.ts` charge tous les fichiers `src/content/fr/**/*.json` : chacun décrit une page (`slug`, `titre`,
   `description`, `chapo`, `image`, `blocs`).
2. `src/pages/[...slug].astro` crée une page par fichier ; `index.astro` crée l'accueil.
3. `PageHero` affiche l'en-tête (fil d'Ariane, titre, résumé, photo), puis `Blocs.astro` parcourt la liste `blocs` et
   affiche pour chaque `type` le composant correspondant (`texte`, `cartes`, `groupes`, `citation`, `chiffres`,
   `cta`, `galerie`, `portraits`, `contact`, `credits`, `legal`). Détail des champs : [CONTENUS.md](CONTENUS.md).
4. `Base.astro` ajoute le `<head>` (titre, description, adresse canonique, Open Graph, `robots`), le menu et le pied de page.

## Photos

Les originaux (265 médias récupérés par l'API publique de l'ancien site) sont dans `data-migration/wp-uploads/`, **hors Git**.
`src/content/images.json` liste les 27 photos retenues (8 autres ont été retirées après relecture : texte alternatif faux, assiettes,
visage en gros plan). `npm run images` les convertit en WebP dans
`src/assets/photos/` ; `Photo.astro` les affiche avec plusieurs tailles (`srcset`) pour que chaque écran charge la bonne.

## Variables d'environnement

Aucune pour la production. Pour un aperçu : `SITE_URL`, `SITE_BASE`, `PUBLIC_MODE_APERCU` (voir `.env.example`).

## Ce qui est prévu mais pas fait

- Anglais : la structure est prête (`src/content/fr/` → `src/content/en/`), pas de traduction encore.
- Formulaire de contact : voir [POINTS-A-VALIDER.md](POINTS-A-VALIDER.md).
- Back-office : les textes étant en JSON, un outil de type Decap CMS ou Keystatic peut les éditer ; à décider.
