// Contrôle du site construit (dossier dist/) : à lancer après `npm run build`, avant toute mise en ligne.
//
//   npm run build && npm run verifier
//
// Vérifie ce qui protège les visiteurs et le référencement :
//   - aucune ressource chargée depuis un site tiers : attributs src, href, srcset, poster, data des pages ;
//     @import et url() des fichiers CSS ; adresses http(s) dans les fichiers JavaScript (hors espaces de noms XML) ;
//   - aucune balise iframe, object, embed, video, audio, form ni redirection meta (revue sécurité requise pour chacune) ;
//   - aucun script ni style « en ligne », aucun gestionnaire d'événement en ligne (la CSP du .htaccess les interdit) ;
//   - tous les liens et images internes existent ;
//   - chaque page (hors 404) a un titre, une description, un seul h1, une langue, une adresse canonique ;
//   - toutes les images ont un attribut alt ; les titres ne sautent pas de niveau ; aucun balisage « [en] » oublié ;
//   - avertissements : titre de plus de 70 caractères, description de plus de 160 (tronqués dans Google).
// Ce que ce contrôle NE couvre PAS : le comportement réel de l'hébergeur (en-têtes, redirections : voir docs/DEPLOIEMENT.md),
// les lecteurs d'écran, le rendu des polices. Code de sortie 1 si une erreur est trouvée.
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve(import.meta.dirname, '../dist');
if (!fs.existsSync(dist)) {
  console.error('dist/ introuvable : lancer « npm run build » d’abord.');
  process.exit(1);
}
const base = (process.env.SITE_BASE ?? '/').replace(/\/$/, '');

const fichiers = (dossier) =>
  fs.readdirSync(dossier, { withFileTypes: true }).flatMap((e) => {
    const chemin = path.join(dossier, e.name);
    return e.isDirectory() ? fichiers(chemin) : [chemin];
  });

const pages = fichiers(dist).filter((f) => f.endsWith('.html'));
const erreurs = [];
const avertissements = [];
const signaler = (liste, page, message) => liste.push(`${path.relative(dist, page)} : ${message}`);

/** Un lien interne (« /offre/ », « /_astro/x.css ») pointe-t-il vers un fichier de dist/ ? */
function existe(cible) {
  let chemin = cible.split('#')[0].split('?')[0];
  if (base && chemin.startsWith(base)) chemin = chemin.slice(base.length) || '/';
  chemin = decodeURIComponent(chemin);
  const complet = path.join(dist, chemin);
  if (chemin.endsWith('/')) return fs.existsSync(path.join(complet, 'index.html'));
  return fs.existsSync(complet);
}

for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');

  const titre = html.match(/<title>([^<]*)<\/title>/)?.[1];
  if (!titre) signaler(erreurs, page, 'balise <title> absente');
  else if (titre.length > 70) signaler(avertissements, page, `titre long (${titre.length} caractères)`);

  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  if (!description) signaler(erreurs, page, 'meta description absente');
  else if (description.length > 160) signaler(avertissements, page, `description longue (${description.length} caractères)`);

  if (!/<html lang="fr"/.test(html)) signaler(erreurs, page, 'langue de la page absente');
  // La page d'erreur n'a pas d'adresse propre : pas d'adresse canonique.
  if (!/<link rel="canonical"/.test(html) && path.basename(page) !== '404.html') signaler(erreurs, page, 'adresse canonique absente');
  if (/\[\/?en\]/.test(html)) signaler(erreurs, page, 'balisage « [en] » non converti dans le texte affiché');
  for (const balise of ['iframe', 'object', 'embed', 'video', 'audio', 'form']) {
    if (new RegExp(`<${balise}[\\s>]`).test(html)) signaler(erreurs, page, `balise <${balise}> : revue sécurité requise`);
  }
  if (/<meta[^>]+http-equiv="refresh"/i.test(html)) signaler(erreurs, page, 'redirection <meta refresh>');
  const nbH1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (nbH1 !== 1) signaler(erreurs, page, `${nbH1} balises h1 (une seule attendue)`);

  // Scripts et styles en ligne.
  for (const m of html.matchAll(/<script\b([^>]*)>/g)) {
    if (!/\bsrc=/.test(m[1]) && !/type="application\/ld\+json"/.test(m[1])) signaler(erreurs, page, 'script en ligne');
  }
  if (/<style\b/.test(html)) signaler(erreurs, page, 'balise <style> en ligne');
  if (/\sstyle="/.test(html)) signaler(erreurs, page, 'attribut style en ligne');
  if (/\son(?:click|load|error)=/.test(html)) signaler(erreurs, page, 'gestionnaire d’événement en ligne');

  // Ressources externes et liens internes.
  for (const m of html.matchAll(/<(\w+)\b([^>]*)>/g)) {
    const [, balise, attributs] = m;
    for (const a of attributs.matchAll(/\s(src|href|srcset|poster|data)="([^"]*)"/g)) {
      const [, nom, valeur] = a;
      const cibles = nom === 'srcset' ? valeur.split(',').map((s) => s.trim().split(/\s+/)[0]) : [valeur];
      for (const cible of cibles) {
        if (/^https?:\/\//.test(cible)) {
          const estLienSortant = balise === 'a';
          const estCanonique = balise === 'link' && /rel="canonical"/.test(attributs);
          if (!estLienSortant && !estCanonique) signaler(erreurs, page, `ressource externe <${balise}> ${cible}`);
        } else if (cible.startsWith('//')) {
          signaler(erreurs, page, `ressource externe <${balise}> ${cible}`);
        } else if (cible.startsWith('/') && !existe(cible)) {
          signaler(erreurs, page, `lien ou fichier introuvable : ${cible}`);
        }
      }
    }
    // Astro réduit alt="" (image décorative) en « alt » seul : les deux écritures sont valides.
    if (balise === 'img' && !/\salt(=|\s|$)/.test(attributs)) signaler(erreurs, page, 'image sans attribut alt');
  }

  // Hiérarchie des titres.
  let precedent = 0;
  for (const m of html.matchAll(/<h([1-6])[\s>]/g)) {
    const niveau = Number(m[1]);
    if (precedent && niveau > precedent + 1) signaler(avertissements, page, `titre h${niveau} après h${precedent}`);
    precedent = niveau;
  }
}

// Fichiers CSS et JavaScript : aucune adresse externe (hors espaces de noms XML du W3C, qui ne sont pas des requêtes).
const espaceDeNoms = /^https?:\/\/(www\.)?w3\.org\//;
const ressources = fichiers(dist).filter((f) => /\.(css|js|mjs)$/.test(f));
for (const fichier of ressources) {
  const contenu = fs.readFileSync(fichier, 'utf8');
  if (fichier.endsWith('.css')) {
    for (const m of contenu.matchAll(/@import\s+(?:url\()?\s*['"]?([^'")\s;]+)/g)) signaler(erreurs, fichier, `@import ${m[1]}`);
    for (const m of contenu.matchAll(/url\(\s*['"]?(?:https?:)?\/\/[^'")]+/g)) signaler(erreurs, fichier, `url() externe : ${m[0]}`);
  } else {
    for (const m of contenu.matchAll(/https?:\/\/[^\s'"`)\\]+/g)) {
      if (!espaceDeNoms.test(m[0])) signaler(erreurs, fichier, `adresse externe : ${m[0]}`);
    }
  }
}

console.log(`${pages.length} pages et ${ressources.length} fichiers CSS ou JavaScript contrôlés.`);
if (avertissements.length) console.log(`\nAvertissements (${avertissements.length}) :\n- ${avertissements.join('\n- ')}`);
if (erreurs.length) {
  console.error(`\nErreurs (${erreurs.length}) :\n- ${erreurs.join('\n- ')}`);
  process.exit(1);
}
console.log('Aucune erreur.');
