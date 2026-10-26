# Modifier les contenus (sans développeur)

Public : Alice, Margaux, Yohann, toute personne qui relit ou corrige les textes. Il suffit d'un éditeur de texte (VS Code) :
le site se reconstruit ensuite en une commande, faite par Damien ou par Jarvis.

## Où sont les textes ?

Un fichier par page, dans `src/content/fr/` :

| Page du site | Fichier |
|---|---|
| Accueil | `accueil.json` |
| Offre et ses 4 pages | `offre/index.json`, `offre/ceramiques-techniques.json`, `offre/imprimerie-serigraphique.json`, `offre/decoration-traitements-de-surface.json`, `offre/developpements-services-industriels.json` |
| Matériaux | `materiaux/index.json` et un fichier par matériau |
| Marchés | `marches/index.json` et un fichier par marché |
| Outil industriel | `outil-industriel.json` |
| Entreprise | `entreprise/index.json`, `historique.json`, `actionnariat.json`, `certifications.json`, `partenaires.json` |
| Contact, légal | `contact.json`, `mentions-legales.json`, `confidentialite.json` |
| Menu, coordonnées, pied de page | `src/content/site.json` |

## Corriger un texte

Ouvrir le fichier, repérer la phrase, la modifier **entre les guillemets droits** `"..."`. Règles à respecter :

- ne pas supprimer les guillemets `"`, les virgules `,` ni les accolades `{ }` et crochets `[ ]` ;
- pour écrire un guillemet droit dans un texte, le précéder d'une barre oblique inverse : `\"` (mieux : utiliser « » et l'apostrophe typographique ’) ;
- pas de balise HTML dans les textes : ils sont affichés tels quels ;
- pour un mot anglais (lu à part par les lecteurs d'écran), l'entourer de `[en]` et `[/en]` : `chromos basse température ([en]on-glaze[/en])`. Seulement dans les textes affichés (paragraphes, listes, `chapo`), pas dans `description` ni `titreSeo`.

Exemple (`marches/horlogerie.json`) :

```json
"chapo": "Bernardaud Solutions Industrielles met ses compétences en imprimerie sérigraphique, décoration et traitements de surface au service des composants horlogers.",
```

Après une modification, lancer `npm run build` puis `npm run verifier` : une faute de syntaxe est signalée tout de suite.

## Champs d'une page

| Champ | Rôle |
|---|---|
| `slug` | adresse de la page (`offre/ceramiques-techniques` donne `/offre/ceramiques-techniques/`) ; ne pas le changer sans prévenir : les liens et le référencement en dépendent |
| `titre` | titre affiché (h1) |
| `titreSeo` | titre dans Google (60 à 70 caractères : mot-clé puis « \| Bernardaud Solutions Industrielles ») |
| `description` | texte sous le titre dans Google (150 caractères environ) |
| `surtitre`, `sousTitre`, `chapo` | petit texte au-dessus du titre, ligne sous le titre, résumé |
| `image` | nom d'une photo de `images.json` pour l'en-tête |
| `brouillon` | `true` : la page est exclue de Google (utile pour les pages en cours de rédaction) |
| `blocs` | la liste des blocs de la page, dans l'ordre |

## Les blocs

| `type` | À quoi ça sert | Champs principaux |
|---|---|---|
| `texte` | titre + paragraphes + liste à puces, avec ou sans photo | `titre`, `surtitre`, `paragraphes` (liste), `liste` (puces), `colonnes` (`true` : puces sur 2 colonnes), `paragraphesApres`, `image`, `imageSens` (`gauche` ou `droite`), `fond` (`alt` : fond beige, `sombre`) |
| `cartes` | cartes cliquables vers d'autres pages | `style` (`piliers` : avec photo et numéro, `liens` : sobres), `titre`, `intro`, `cartes` : chaque carte a `titre`, `texte`, `href`, `image` ou `motif: true` |
| `groupes` | blocs de listes (applications, sites) | `titre`, `intro`, `groupes` : chacun a `titre`, `texte`, `items` (puces), `lien` |
| `citation` | citation avec portrait | `texte`, `auteur`, `fonction`, `image` |
| `chiffres` | chiffres clés | `items` (`valeur`, `libelle`), **`visible`** : `false` tant que la direction n'a pas tranché |
| `cta` | bandeau d'appel à l'action | `titre`, `texte`, `bouton` (`libelle`, `href`) |
| `galerie` | rangée de photos | `images` : `nom` et `legende` |
| `portraits` | portraits avec légende | `personnes` : `image`, `nom`, `fonction` |
| `contact`, `credits`, `legal` | blocs spéciaux (coordonnées, crédits photo, texte juridique) | voir `contact.json`, `mentions-legales.json` |

## Afficher les chiffres clés

Dans `accueil.json`, le bloc `"type": "chiffres"` contient `"visible": false`. Remplacer par `true` une fois le choix fait
(voir `POINTS-A-VALIDER.md` : surfaces de 60 000 ou 45 000 m², arbitrage de Charles).

## Ajouter une page

1. Copier un fichier existant du même dossier, le renommer (`nom-de-la-page.json`) et changer `slug`, `titre`, `description` et les blocs.
2. Ajouter la page au menu dans `src/content/site.json` (sinon elle n'est pas accessible).
3. `npm run build && npm run verifier`.

## Ajouter ou remplacer une photo

1. Déposer l'original (la meilleure définition disponible, idéalement 2000 pixels de large ou plus) dans `data-migration/ajouts/` (dossier hors Git).
2. Ajouter une ligne à `src/content/images.json` : `name` (sans espace ni accent), `fichier` (nom du fichier déposé), `alt` (texte alternatif : décrire ce qu'on voit, en une phrase), `credit` (`null` si aucun crédit à afficher), `maxWidth` (2000 pour une photo d'en-tête).
3. `npm run images`, puis utiliser le `name` dans la page (`"image": "mon-nom"`).
4. **Règles** : pas de photo de projet ni de nom de client (consigne de Charles) ; vérifier les droits de la photo ; toujours un texte alternatif.

## Ce qu'on ne fait pas

- Aucun script, vidéo, carte ou police venant d'un autre site : cela enverrait des données des visiteurs à des tiers et serait bloqué par la politique de sécurité (voir `SECURITE.md`).
- Aucun nom de client ni photo de réalisation sur le site (consigne de Charles Bernardaud, 31/07/2026) ; les réalisations iront, le cas échéant, dans une rubrique Actualités.
