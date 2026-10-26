# Déploiement

> Aucune mise en ligne n'est faite sans l'accord explicite de Damien. Les identifiants d'hébergement (SFTP, espace client OVH)
> ne sont **jamais** écrits dans un fichier du dépôt : gestionnaire de mots de passe, ou secrets GitHub saisis par Damien.

## 1. Construire et contrôler

```bash
npm ci
npm run build
npm run verifier     # doit afficher « Aucune erreur. »
```

Le dossier `dist/` contient le site complet, `.htaccess` compris (fichier caché : l'afficher dans le client SFTP).

## 2. Aperçu de validation (avant la mise en ligne)

Un aperçu n'est **jamais indexé** (`PUBLIC_MODE_APERCU=1` ajoute `noindex` et un `robots.txt` qui interdit tout).

### Option A : GitHub Pages (workflow `.github/workflows/apercu.yml`, lancement manuel) : déconseillée pour ce contenu

- **Attention : le dépôt peut être privé, mais le site GitHub Pages est public**, accessible à toute personne qui connaît l'adresse,
  sauf avec GitHub Enterprise Cloud (seule offre qui permet de restreindre l'accès à un site Pages privé). Un aperçu de validation en
  ligne diffuserait donc des textes non validés, des brouillons et des photos dont les droits ne sont pas réglés (c'est déjà le cas
  de la version Codex sur `DTaillemaud/bernardaudsi-preview`). **À vérifier pour l'organisation Bernardaud-IT** avant tout usage ; sinon
  utiliser l'option B.
- Le site est alors à `https://<organisation>.github.io/bernardaudsi-site/` : variables `SITE_URL=https://bernardaud-it.github.io`
  et `SITE_BASE=/bernardaudsi-site/` (déjà dans le workflow).
- Lancer : onglet *Actions* du dépôt, « Aperçu de validation », *Run workflow*. Le workflow n'est pas encore testé sur GitHub ;
  la construction en sous-dossier, elle, a été essayée en local (29 pages, contrôle sans erreur, `noindex`, `robots.txt` qui interdit tout).
- Pour reproduire l'aperçu en local depuis **Git Bash** sous Windows, ajouter `MSYS_NO_PATHCONV=1` devant la commande : sans cela Git Bash
  transforme `/bernardaudsi-site/` en chemin Windows. PowerShell et GitHub Actions n'ont pas ce problème.
- Une page GitHub Pages d'un dépôt privé reste accessible à toute personne qui a l'adresse si l'offre ne permet pas de la restreindre :
  vérifier les réglages d'accès avant de partager le lien.

### Option B : sous-domaine OVH protégé par mot de passe (recommandé)

1. Dans l'espace client OVH, créer un sous-domaine (par exemple `apercu.bernardaudsi.com`) pointant vers un dossier dédié.
2. Y protéger l'accès par mot de passe (`.htpasswd` + `.htaccess`, ou l'outil de protection d'OVH) : **Damien crée le mot de passe**,
   Jarvis ne le manipule pas.
3. Construire : `PUBLIC_MODE_APERCU=1 SITE_URL=https://apercu.bernardaudsi.com npm run build` (PowerShell :
   `$env:PUBLIC_MODE_APERCU='1'; $env:SITE_URL='https://apercu.bernardaudsi.com'; npm run build`).
4. Déposer le contenu de `dist/` dans le dossier du sous-domaine.

## 3. Mise en ligne sur OVH Web Cloud

À préciser quand le plan d'hébergement exact sera connu (Perso, Pro, Performance) : accès SFTP ou SSH, version de PHP, prise en charge
de `.htaccess`, certificat SSL.

### Avant

1. **Sauvegarder le WordPress actuel** : fichiers et base de données (outils de sauvegarde d'OVH, ou export). Ne rien supprimer.
2. Vérifier que le certificat SSL de `bernardaudsi.com` est actif sur l'hébergement.
3. Construire **sans** variable d'aperçu : `npm run build && npm run verifier`.
4. Revue sécurité (agent `security-reviewer`) et accord écrit de Damien.

### Bascule sans interruption (recommandée)

1. Créer sur l'hébergement un **nouveau dossier** (par exemple `bsi-site/`) et y déposer le contenu de `dist/`.
2. Le tester avec une adresse temporaire (sous-domaine ou, si l'offre le permet, l'adresse technique de l'hébergement).
3. Dans l'espace client, **changer le dossier racine** du domaine `bernardaudsi.com` pour `bsi-site/`. L'ancien WordPress reste intact dans son dossier.
4. Contrôler (section suivante). Garder l'ancien WordPress une à deux semaines avant de le retirer.

*Retour arrière* : remettre l'ancien dossier racine dans l'espace client (quelques minutes, selon la propagation).

### Contrôles après la mise en ligne

```bash
curl -sI https://bernardaudsi.com/ | head -20             # en-têtes : CSP, nosniff, X-Frame-Options, etc.
curl -sI http://bernardaudsi.com/ | head -5               # doit rediriger (301) vers https
curl -s https://bernardaudsi.com/robots.txt               # doit annoncer le sitemap, sans « Disallow: / »
curl -sI https://bernardaudsi.com/page-qui-n-existe-pas/  # 404 avec la page d'erreur du site
```

- Parcourir les pages principales sur ordinateur et téléphone ; vérifier qu'aucune alerte de contenu bloqué n'apparaît (console du navigateur).
- Tester l'adresse sur securityheaders.com et sur un outil d'audit d'accessibilité.
- Déclarer `https://bernardaudsi.com/sitemap-index.xml` dans la Search Console de Google.
- **HSTS** : après une semaine sans problème, retirer le `#` de la ligne `Strict-Transport-Security` de `public/.htaccess` (durée courte, 1 jour,
  sans `includeSubDomains`), reconstruire et redéposer. Une semaine plus tard, passer à un an (`max-age=31536000`). Ne pas ajouter
  `includeSubDomains` sans avoir vérifié HTTPS sur tous les sous-domaines (messagerie, aperçu).
- **Une seule adresse** : le `.htaccess` redirige `www.bernardaudsi.com` vers `bernardaudsi.com`. Contrôler :
  `curl -sI https://www.bernardaudsi.com/ | head -3` (doit répondre 301 vers l'adresse sans `www`). Le DNS doit déclarer les deux noms.
- **`Options -Indexes`** n'est pas dans le fichier (erreur 500 possible selon l'offre). Contrôler qu'un dossier sans page, par exemple
  `https://bernardaudsi.com/_astro/`, n'affiche pas de liste de fichiers ; sinon ajouter la directive si OVH l'autorise.
- Rediriger les anciennes adresses WordPress importantes vers les nouvelles (règles `Redirect 301` dans `.htaccess`) : liste à établir à partir de l'ancien plan du site.

## 4. Mise à jour courante

1. Modifier un fichier de `src/content/fr/` (voir `CONTENUS.md`).
2. `npm run build && npm run verifier`.
3. Déposer le contenu de `dist/` (les fichiers modifiés suffisent, mais redéposer tout le dossier est plus sûr).
4. Noter la modification dans `CHANGELOG.md`.

## 5. Plus tard : déploiement automatique

Un workflow GitHub Actions pourrait déposer `dist/` par SFTP à chaque fusion sur `main`. Il demande de stocker les identifiants SFTP d'OVH
dans les secrets du dépôt et une revue sécurité dédiée : à décider avec Damien une fois la première mise en ligne faite à la main.
