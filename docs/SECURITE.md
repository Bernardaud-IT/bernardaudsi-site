# Sécurité, cookies et vie privée

## Principe

Le plus sûr est de ne rien avoir à protéger : le site est un ensemble de **fichiers statiques**. Il n'y a ni connexion, ni
base de données, ni formulaire, ni plugin. Un pirate n'a presque aucune prise.

## Ce que le site fait (et ne fait pas)

| Sujet | État |
|---|---|
| Cookies | **Aucun.** Ni cookie, ni stockage local, ni identifiant. Donc **aucun bandeau de consentement** n'est nécessaire (la page Confidentialité l'explique aux visiteurs). |
| Mesure d'audience | **Aucune.** Si elle devient nécessaire : un outil sans cookie et auto-hébergé (par exemple Matomo configuré pour l'exemption de consentement de la CNIL), après décision et mise à jour de la page Confidentialité. |
| Ressources de tiers | **Aucune** : polices, images, scripts, cartes et vidéos viennent du site lui-même. Le contrôle `npm run verifier` échoue si une ressource externe apparaît dans les pages, les fichiers CSS ou les fichiers JavaScript (détail plus bas, avec ses limites). |
| JavaScript | Un seul petit fichier (menu mobile). Le site fonctionne sans. |
| Formulaires | Aucun pour l'instant (coordonnées affichées). Le futur formulaire de contact est décrit dans `POINTS-A-VALIDER.md` : il demandera une revue sécurité dédiée. |

## En-têtes HTTP (fichier `public/.htaccess`)

Posés par le serveur Apache d'OVH ; ils protègent les visiteurs même si une faille était trouvée dans une page.

| En-tête | Effet |
|---|---|
| `Content-Security-Policy` | Le navigateur n'accepte que ce qui vient du site lui-même : ni script ni style en ligne, aucun cadre, aucun objet, `form-action 'self'`, `frame-ancestors 'none'`, mise à niveau vers HTTPS. Bloque l'injection de scripts (XSS). |
| `X-Content-Type-Options: nosniff` | Interdit au navigateur de deviner le type d'un fichier. |
| `X-Frame-Options: DENY` | Interdit d'afficher le site dans un cadre d'un autre site (détournement de clic). |
| `Referrer-Policy: strict-origin-when-cross-origin` | Limite ce qui est transmis aux sites vers lesquels on clique. |
| `Permissions-Policy` | Désactive caméra, micro, géolocalisation, paiement, etc. |
| `Cross-Origin-Opener-Policy` et `Cross-Origin-Resource-Policy` | Isolation du site vis-à-vis des autres sites. |
| `Strict-Transport-Security` (HSTS) | **Prévu mais commenté** : à activer seulement une fois HTTPS vérifié (il est ensuite mémorisé par les navigateurs), d'abord pour 1 jour puis un an, **sans** `includeSubDomains`. Voir `DEPLOIEMENT.md`. |
| Redirection HTTPS, `www` vers l'adresse sans `www`, fichiers cachés interdits, `X-Powered-By` retiré | Hygiène du serveur. La redirection suit le nom de domaine demandé (l'aperçu sur un sous-domaine reste sur son sous-domaine). |

À valider sur l'hébergement réel : certaines options Apache dépendent de l'offre OVH (module `mod_headers`, balise `<If>`). La
vérification se fait avec `curl -I https://bernardaudsi.com/` (voir `DEPLOIEMENT.md`) ou sur securityheaders.com.

## Ce que `npm run verifier` contrôle

- aucune ressource externe dans les pages (`src`, `href`, `srcset`, `poster`, `data`, hors liens sortants `<a>` et adresse canonique) ;
- aucun `@import` ni `url()` externe dans les fichiers CSS, aucune adresse `http(s)` dans les fichiers JavaScript (hors espaces de noms XML du W3C) ;
- aucune balise `iframe`, `object`, `embed`, `video`, `audio`, `form` ni redirection `<meta refresh>` (chacune demande une revue sécurité) ;
- aucun `<script>` ni `<style>` ni attribut `style` ni gestionnaire d'événement en ligne (la CSP les interdirait) ;
- tous les liens et fichiers internes existent ;
- chaque page a un titre (70 caractères au plus, sinon avertissement), une description (160 au plus), une langue, une adresse canonique (sauf la 404) et un seul `h1` ;
- toutes les images ont un attribut `alt` ; les niveaux de titres ne sautent pas ; aucun balisage `[en]` n'est resté dans un texte.

**Ce que ce contrôle ne couvre pas** : le comportement réel de l'hébergeur (en-têtes, redirections), les adresses déclarées dans les balises
`<meta>` (Open Graph, par exemple), les lecteurs d'écran, le rendu des polices. Ces points se vérifient à la mise en ligne (`DEPLOIEMENT.md`).

## Accessibilité

Contrastes calculés conformes WCAG AA (voir l'en-tête de `src/styles/global.css`), navigation au clavier (lien d'évitement, focus
visible, sous-menus accessibles), repères ARIA, `prefers-reduced-motion` respecté, taille de texte relative. Une relecture par un
outil d'audit (par exemple Lighthouse ou Wave) reste à faire sur le site en ligne.

## Dépendances

Versions verrouillées dans `package-lock.json`. À chaque mise à jour : `npm audit`, `npm outdated`, `npm run build`, `npm run verifier`.
Pas de dépendance côté visiteur à part Astro lui-même (utilisé seulement à la construction).

## Données personnelles (RGPD)

Le site ne collecte rien. Restent : les journaux techniques de l'hébergeur (adresse IP, page, date), et les e-mails reçus à l'adresse
de contact. La page Confidentialité est un **brouillon à compléter et à faire valider** (responsable du traitement, durées de
conservation, contact RGPD).

## Dépôt GitHub public

Le dépôt `Bernardaud-IT/bernardaudsi-site` est **public** depuis le 2026-10-27 (décision de Damien). Conséquences :

- Tout est lisible par n'importe qui, **y compris l'historique** : jamais de secret, de mail, de document source ni de coordonnée de personne dans un fichier commité. Les pièces sources (mails, Word, PowerPoint, `data-migration/`) restent hors Git (`.gitignore`).
- GitHub **secret scanning** et **push protection** sont activés : un secret reconnu est signalé, et le push est bloqué. Dependabot surveille les dépendances. Ce n'est pas une garantie : la relecture reste la règle.
- Sans fichier de licence, tous les droits restent réservés à Bernardaud : public ne veut pas dire réutilisable.
- Les **photos** de `src/assets/photos/` sont visibles et téléchargeables par tous. Leurs droits ne sont pas tous confirmés (B6, B8, B9 de `POINTS-A-VALIDER.md`). Retirer une photo d'un commit ne l'efface pas de l'historique : si une photo ne doit pas être publique, il faut le dire à Damien (réécriture d'historique ou nouveau dépôt).
- Pas de protection technique de la branche `main` pour l'instant : la règle « branche + pull request, jamais de push direct » est une convention d'équipe.
- Un site GitHub Pages reste exclu (voir `DEPLOIEMENT.md`) : l'aperçu de validation va sur un sous-domaine OVH protégé par mot de passe.

## Ce qui est à surveiller côté Bernardaud

- L'ancien site WordPress : tant qu'il est en ligne, il affiche la version de PHP (8.0, fin de vie), une API REST publique et aucun en-tête de sécurité. Le remplacer par ce site supprime ces risques.
- Les identifiants d'administration du WordPress circulent en clair dans un e-mail du 24/07/2026 : à changer, puis à supprimer quand le WordPress est retiré.
- Les accès SFTP d'OVH ne doivent jamais être écrits dans un fichier du dépôt ni dans un e-mail : gestionnaire de mots de passe ou secrets GitHub.
