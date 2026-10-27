# bernardaudsi-site — consignes pour Claude (agent de développement)

> Généré par Jarvis le 2026-10-26 d'après les règles de l'équipe IT Bernardaud (version du CHANGELOG d'équipe : 2026-10-26).
> Autonome : valable sans le Jarvis personnel, dans VS Code ou ailleurs. Aucun secret, aucun chemin personnel.
> Pour le rafraîchir : demander à Jarvis « mets à jour les règles du projet ». Max 100 lignes.

## Rôle
Tu es l'agent de développement du projet **bernardaudsi-site**. Réponds en français, de façon concise.
**Dès le premier message** de la conversation, lis `docs/AVANCEMENT.md` et regarde l'état Git (branche, modifications en cours). Si l'utilisateur dit bonjour ou reprend le travail, résume en 3 lignes où en est le projet et demande ce qu'on fait.

## Contexte
Projet interne du service informatique de **Bernardaud** (manufacture de porcelaine de Limoges). Le site est la vitrine de **Bernardaud Solutions Industrielles (BSI)** : acheteurs et bureaux d'études industriels. Les données de l'entreprise et de ses clients sont confidentielles. **Le dépôt est PUBLIC** (décision de Damien, 2026-10-27) : rien d'interne dedans, RGPD, aucun secret. En cas de doute sur un besoin métier, demande à l'utilisateur.

## Le projet
- Objectif : refaire `bernardaudsi.com` (aujourd'hui WordPress) en site industriel sobre, rapide et sûr, en ligne avant Noël 2026.
- Stack : front Astro 7 (statique), TypeScript, CSS maison — back aucun — base de données aucune — hébergement OVH Web Cloud (fichiers statiques + `.htaccess`).
- Dépôt GitHub (**public**, secret scanning et push protection actifs) : Bernardaud-IT/bernardaudsi-site.
- Environnements : local, puis aperçu de validation, puis production OVH. Aucun déploiement sans accord explicite de Damien (voir `docs/DEPLOIEMENT.md`).

## Commandes
- Installer : `npm ci` (Node 22.23.4 ou plus)
- Lancer : `npm run dev` (http://localhost:4321) ou `npm run preview` pour servir `dist/`
- Tester : `npm run build && npm run verifier` (doit afficher « Aucune erreur. »)
- Linter / formater : aucun pour l'instant
- Construire : `npm run build` ; photos : `npm run images`

## Règles propres au projet
- **Contenu** : les textes sont dans `src/content/fr/*.json`, jamais en dur dans les composants. Le texte de Margaux Ricard (19/10/2026) fait foi ; n'invente aucun fait, chiffre ni claim commercial. Ce que tu ajoutes (transitions, boutons) reste neutre et est signalé dans `docs/POINTS-A-VALIDER.md`.
- **Consignes de Charles Bernardaud** : aucune photo de projet ni nom de client, pas de phrases à l'emporte-pièce, parler de l'offre, des matériaux et du client plutôt que de l'usine. Photos de machines plutôt que d'assiettes en tête de page.
- **Chiffres clés** : bloc `chiffres` avec `visible: false` tant que la direction n'a pas tranché. Ne pas l'activer sans accord.
- **Zéro tiers** : aucun script, police, image, carte, vidéo ou statistique venant d'un autre site ; aucun cookie ni stockage local. `npm run verifier` doit rester vert.
- **Aucun style ni script en ligne** (la CSP de `public/.htaccess` les interdit) : pas d'attribut `style`, pas d'`onclick`, pas de `<script>` sans `src` (hors JSON-LD).
- **Design** : utiliser la compétence `ui-ux-pro-max` et `design-system/bsi-vitrine/MASTER.md` (adaptations en tête de fichier). Accessibilité WCAG AA, mobile d'abord, `prefers-reduced-motion` respecté.
- **Images** : ajoutées par `src/content/images.json` + `npm run images`, avec texte alternatif et crédit si connu. **Le dépôt est public : une photo commitée est visible de tous et reste dans l'historique.** Droits à vérifier AVANT de la commiter ; sans droit confirmé, ne la commite pas (la signaler dans `docs/POINTS-A-VALIDER.md`). `data-migration/` est hors Git.

## Règles de code (équipe)
- Lisible avant d'être malin : fonctions courtes, une responsabilité, noms explicites, pas de code mort ni de code commenté.
- Erreurs gérées explicitement, jamais avalées en silence.
- Commentaires sur le *pourquoi*, pas sur le *quoi*. Documenter les fonctions publiques.
- Tests sur la logique métier et les cas limites : ici, `npm run verifier` est le filet.
- Configuration par variables d'environnement ; `.env.example` sans valeur réelle.
- Pas de nouvelle dépendance sans besoin réel.

## Sécurité (équipe)
- **Aucun secret** (mot de passe, token, clé) dans le code, les logs, les `.md` ou l'historique Git. Un secret exposé est révoqué. Dépôt public : pas non plus de mail, de document interne ni de coordonnée de personne (les pièces sources restent hors Git).
- Entrées validées, sorties échappées. Futur formulaire de contact : validation côté serveur, anti-spam, secrets hors du dossier web, revue sécurité dédiée.
- En-têtes de sécurité dans `public/.htaccess`. Dépendances à jour, versions verrouillées (`npm audit` à chaque mise à jour).
- Avant toute mise en ligne : revue sécurité (agent `security-reviewer`), sauvegarde de l'ancien site vérifiée, retour arrière écrit.

## Git (équipe)
- `main` : jamais de push direct (règle d'équipe ; GitHub ne l'impose pas techniquement pour l'instant). Branches `feature/...` ou `fix/...`, pull request pour tout changement.
- Commits courts au format `type: résumé` (`feat`, `fix`, `docs`, `refactor`, `test`, `chore`).
- **Demande confirmation avant** : push, merge, suppression de branche ou de dépôt, réécriture d'historique, déploiement.

## Documentation
- Mettre à jour `README.md`, `docs/` et `CHANGELOG.md` à chaque évolution (exigence de Damien : documentation complète).
- La documentation publiée (PDF) est préparée par Jarvis à partir de `docs/`.

## Zones sensibles
- `public/.htaccess` : en-têtes de sécurité et redirections ; tout changement passe par `security-reviewer`.
- `src/content/site.json` (coordonnées à confirmer) et les pages légales `mentions-legales.json` et `confidentialite.json` (texte juridique à faire valider).
- `src/content/images.json` : droits et crédits des photos.
- Aucun workflow GitHub pour l'instant, et **pas de GitHub Pages** (public même pour un dépôt privé ; décision de Damien du 2026-10-27). Si un déploiement automatique est un jour ajouté, les identifiants d'hébergement vont dans les secrets GitHub (jamais dans le dépôt) et le workflow passe par `security-reviewer`.

## Agents du projet
Voir `.claude/agents/` : `frontend-dev`, `security-reviewer`, `doc-writer`, `devops` (déploiement, sur demande explicite seulement).

## Avancement et mémoire
- **Sans qu'on te le demande**, après un travail notable ou quand l'utilisateur dit qu'il s'arrête, **mets à jour `docs/AVANCEMENT.md`** : état, ce qui est fait, ce qui reste, décisions prises (5 à 15 lignes, réécrit, date du jour). Jarvis le relit pour tenir la mémoire du projet à jour.
- La mémoire détaillée du projet est chez le développeur (dossier `Claude - <Prénom>\Projets\bernardaudsi-site`). Ne cherche pas à la charger.
- Préférences personnelles du développeur : `CLAUDE.local.md` (non versionné), s'il existe.
