# Points à valider et éléments à fournir

Liste vivante : barrer ou supprimer une ligne quand elle est traitée. « Qui » indique la personne qui peut trancher ou fournir.

## A. Arbitrages de contenu

| # | Point | Contexte | Qui | État |
|---|---|---|---|---|
| A1 | **Chiffres clés** (60 000 m², 750 collaborateurs, 75 % d'export, ISO) | Charles demande de les retirer (mail du 31/07, point 1.i). Les textes de Margaux (19/10) les conservent. Le bloc existe dans `accueil.json` avec `visible: false` : rien n'est affiché. | Charles, Margaux | à trancher |
| A2 | **Surface industrielle** : 60 000 m² ou 45 000 m² ? | Le mail de Charles dit 60 000 m², l'architecture rev4 dit 45 000 m². | Charles, Yohann | à trancher (si A1 les garde) |
| A3 | **Matériaux manquants** : cordiérite, C120, etc. | Charles (point 6.d) : « à voir avec Yohann et Charles ». Les 5 matériaux de Margaux sont en place. | Yohann, Charles | à fournir |
| A4 | **Tableau des propriétés** des matériaux | Présent dans l'architecture rev4 (diapositives 28 à 30), non repris : Charles doit valider « la science ». | Charles | à valider |
| A5 | **Galerie des générations** | Demandée par Charles (Historique 2.d) et marquée « à prévoir » par Margaux : attributions historiques à valider, portraits à fournir. | Charles, Margaux | à fournir |
| A6 | **Rubrique Actualités** (publications, événements, salons) | Charles : « éventuelle rubrique actualité » pour les réalisations. Absente de la version 1 (les réalisations sont retirées du site). | Charles, Alice | à décider |
| A7 | **Plaquette Défense** | Charles demande de refaire la page à partir du leaflet (`BSI_Leaflet-ProtectionBallistique_260722.pdf`). Le texte de Margaux est en place ; proposer le PDF en téléchargement ? | Charles | à décider |
| A8 | **Citation de Michel Bernardaud** | Version courte de Margaux utilisée (conforme à la demande de Charles : plus directe). À faire relire par M. Bernardaud. | Michel Bernardaud | à valider |
| A9 | **Accord des partenaires** (IRCER, CTTC, CITRA, CEDREM) | Charles : « on demandera l'accord aux partenaires ». Seuls les noms sont affichés, pas de logos. | Charles, Alice | à demander |
| A10 | **Textes ajoutés par Jarvis** | Titres de sections, boutons, phrases de transition (« Parlons de votre projet », « Pour aller plus loin », chapeau de Contact…) : faits uniquement à partir des phrases de Margaux, à relire. | Margaux | à relire |
| A11 | **Anglais** | Version FR/EN prévue dans l'architecture rev4 ; hors périmètre de la version 1. | Alice, Margaux | à planifier |

## B. Informations à confirmer

| # | Point | Où | Qui |
|---|---|---|---|
| B1 | Adresse, courriel et téléphone de contact : valeurs provisoires (adresse de Limoges d'après la signature de Charles, 87000) ; la version Codex indiquait 87100 | `src/content/site.json` (mettre `aConfirmer` à `false` une fois confirmé : l'avertissement disparaît) | Alice |
| B2 | Mentions légales : éditeur (raison sociale, SIREN, TVA), directeur de la publication, hébergeur à vérifier | `mentions-legales.json` (textes `[à compléter : …]`) | Direction, juridique |
| B3 | Confidentialité : responsable du traitement, contact RGPD, durées de conservation | `confidentialite.json` | Direction, DPO |
| B4 | Les deux pages légales sont en `brouillon: true` (exclues de Google) | idem | Damien, après B2 et B3 |
| B5 | Plan OVH exact : SFTP ou SSH, version de PHP, `.htaccess`, SMTP, certificat SSL | espace client OVH | Damien |
| B6 | Crédit photo : certaines photos (four de cuisson, ateliers) sans crédit connu | `images.json` | Alice |
| B7 | Quatre vues aériennes des sites (médias 646 à 649 de l'ancien site) non utilisées : à identifier site par site | `data-migration/wp-uploads/` | Yohann |

## C. Visuels à fournir (haute définition, droits réglés)

| Page | Besoin |
|---|---|
| Logo | **Fichier vectoriel (SVG)** du logo BSI : celui de l'ancien site ne dépasse pas 512 pixels. |
| Certifications | Logos ISO 9001 et ISO 14001 officiels (Charles : « changer les logos ISO pour les bons »). La marque SOCOTEC de l'ancien site (256 pixels) est utilisée en attendant. |
| Décoration et traitements de surface | Photo de dépôt PVD ou de pièces traitées (aucune photo disponible : carte à motif graphique). |
| Horlogerie | Photos de cadrans, carrures, bracelets, verres saphir, sans marque client (Charles : « quitte à en inventer »). |
| Cosmétiques, parfums, vins et spiritueux | Visuels de contenants sans marque. |
| Architecture | Visuels d'éléments architecturaux sans nom de projet. |
| Accueil, offre | Photos de machines (Charles : « pas d'assiettes, privilégier des machines ») : la presse à injecter et l'atelier sont en place ; d'autres machines enrichiraient la page. |
| Portrait de Charles Bernardaud | Version plus grande (387 x 440 pixels aujourd'hui). |

## D. Fonctionnalités reportées (hors version 1)

| Sujet | Piste |
|---|---|
| **Formulaire de contact** | Petit script PHP sur OVH (validation côté serveur, champ piège anti-spam, protection contre l'injection d'en-têtes, envoi par le SMTP d'OVH, identifiants hors du dossier web) + revue sécurité + mention RGPD. |
| **Back-office** | Les textes étant en JSON, un outil comme Decap CMS ou Keystatic peut les éditer, ou Laravel + Filament si Charles veut gérer lui-même le contenu en ligne. À arbitrer avec Damien. |
| **Statistiques** | Aucune pour l'instant. Si besoin : outil sans cookie auto-hébergé. |
| **Redirections** des anciennes adresses WordPress | À établir avant la bascule (voir `DEPLOIEMENT.md`). |
