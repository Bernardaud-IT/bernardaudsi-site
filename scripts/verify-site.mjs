// Contrôle du site construit (dossier dist/) : à lancer après `npm run build`, avant toute mise en ligne.
//
//   npm run build && npm run verifier
//
// Vérifie ce qui protège les visiteurs et le référencement :
//   - aucune ressource chargée depuis un site tiers (vie privée, politique de sécurité) ;
//   - aucun script ni style « en ligne » (la CSP du .htaccess les interdit) ;
//   - tous les liens et images internes existent ;
//   - chaque page a un titre, une description, un seul h1, une langue, une adresse canonique ;
//   - toutes les images ont un texte alternatif ; les titres ne sautent pas de niveau.
// Code de sortie 1 si une erreur est trouvée.
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
  else if (titre.length > 75) signaler(avertissements, page, `titre long (${titre.length} caractères)`);

  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  if (!description) signaler(erreurs, page, 'meta description absente');
  else if (description.length > 175) signaler(avertissements, page, `description longue (${description.length} caractères)`);

  if (!/<html lang="fr"/.test(html)) signaler(erreurs, page, 'langue de la page absente');
  if (!/<link rel="canonical"/.test(html)) signaler(erreurs, page, 'adresse canonique absente');
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

console.log(`${pages.length} pages contrôlées.`);
if (avertissements.length) console.log(`\nAvertissements (${avertissements.length}) :\n- ${avertissements.join('\n- ')}`);
if (erreurs.length) {
  console.error(`\nErreurs (${erreurs.length}) :\n- ${erreurs.join('\n- ')}`);
  process.exit(1);
}
console.log('Aucune erreur.');
