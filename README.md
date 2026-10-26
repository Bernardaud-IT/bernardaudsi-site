# bernardaudsi-site

Site vitrine de **Bernardaud Solutions Industrielles** (BSI), `bernardaudsi.com` : céramiques techniques, imprimerie
sérigraphique, décoration et traitements de surface, développements et services industriels.

C'est un **site statique** fabriqué avec [Astro](https://astro.build) : `npm run build` produit un dossier `dist/` de
fichiers HTML, CSS et images, déposé tel quel sur l'hébergement OVH Web Cloud. Aucun PHP, aucune base de données et
aucun cookie en ligne.

> Version de validation : le contenu suit les textes de Margaux Ricard (19/10/2026) et les retours de Charles Bernardaud.
> Les points encore à trancher sont listés dans [docs/POINTS-A-VALIDER.md](docs/POINTS-A-VALIDER.md).

## Démarrer

Prérequis : **Node.js 22.23.4 ou plus** (Astro 7 refuse les versions précédentes).

```bash
npm ci            # installe les dépendances (versions verrouillées)
npm run dev       # site de développement sur http://localhost:4321
npm run build     # construit le site dans dist/
npm run verifier  # contrôle dist/ : ressources externes, scripts en ligne, liens, SEO, accessibilité de base
npm run preview   # sert dist/ en local, tel qu'il sera en ligne
```

## Modifier un texte ou une image

Les textes sont dans `src/content/fr/` (un fichier JSON par page), les photos retenues dans `src/content/images.json`.
Aucun code à toucher : voir [docs/CONTENUS.md](docs/CONTENUS.md).

## Documentation

| Document | Contenu |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | structure du projet, modèle de contenu, choix techniques |
| [docs/CONTENUS.md](docs/CONTENUS.md) | modifier un texte, ajouter une page ou une image (sans développeur) |
| [docs/SECURITE.md](docs/SECURITE.md) | en-têtes, cookies, RGPD, dépendances, ce qui est contrôlé |
| [docs/DEPLOIEMENT.md](docs/DEPLOIEMENT.md) | aperçu de validation, mise en ligne sur OVH, retour arrière |
| [docs/POINTS-A-VALIDER.md](docs/POINTS-A-VALIDER.md) | arbitrages de contenu, images à fournir, décisions en attente |
| [design-system/bsi-vitrine/MASTER.md](design-system/bsi-vitrine/MASTER.md) | système de design |
| [CHANGELOG.md](CHANGELOG.md) | historique des évolutions |

## Droits des images

Les photos viennent de l'ancien site et des ressources fournies par Bernardaud. Elles ne sont pas déclarées libres de droits :
le dépôt est **privé** et reste interne. Les crédits (par exemple « © Odieux Boby / Bernardaud ») sont dans
`src/content/images.json` et s'affichent dans les mentions légales.
