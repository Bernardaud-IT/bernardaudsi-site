// Prépare les photos du site à partir des originaux récupérés sur l'ancien site WordPress.
//
// Usage : node scripts/images/prepare.mjs
//
// - Lit la liste des images retenues dans src/content/images.json (nom, numéro de média, texte
//   alternatif, crédit). Les originaux, hors Git, sont dans data-migration/wp-uploads/.
// - Écrit des versions WebP redimensionnées dans src/assets/photos/ (versionnées).
// - Génère public/og-default.jpg (1200 x 630) pour l'aperçu des liens partagés.
//
// Ajouter une photo : l'ajouter à images.json, relancer le script, puis l'utiliser par son nom.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const racine = path.resolve(import.meta.dirname, '../..');
const dossierOriginaux = path.join(racine, 'data-migration/wp-uploads');
const dossierSortie = path.join(racine, 'src/assets/photos');

const manifeste = JSON.parse(fs.readFileSync(path.join(racine, 'src/content/images.json'), 'utf8'));
const inventaire = JSON.parse(fs.readFileSync(path.join(dossierOriginaux, 'inventory.json'), 'utf8'));
const parMedia = new Map(inventaire.map((i) => [i.id, i]));

fs.mkdirSync(dossierSortie, { recursive: true });

let total = 0;
// Une image vient soit de l'ancien site (champ « media » : numéro dans l'inventaire), soit d'un fichier
// ajouté à la main (champ « fichier » : nom du fichier déposé dans data-migration/ajouts/).
const dossierAjouts = path.join(racine, 'data-migration/ajouts');

for (const image of manifeste) {
  let entree;
  if (image.fichier) {
    entree = path.join(dossierAjouts, image.fichier);
  } else {
    const source = parMedia.get(image.media);
    if (!source) {
      console.error(`Média ${image.media} (${image.name}) introuvable dans l'inventaire`);
      process.exitCode = 1;
      continue;
    }
    entree = path.join(dossierOriginaux, source.fichier);
  }
  if (!fs.existsSync(entree)) {
    console.error(`Fichier introuvable pour ${image.name} : ${entree}`);
    process.exitCode = 1;
    continue;
  }
  const sortie = path.join(dossierSortie, `${image.name}.webp`);
  const info = await sharp(entree)
    .rotate() // respecte l'orientation EXIF
    .resize({ width: image.maxWidth, withoutEnlargement: true })
    .webp({ quality: image.quality ?? 80, effort: 5 })
    .toFile(sortie);
  total += info.size;
  console.log(`${image.name.padEnd(28)} ${String(info.width).padStart(4)}x${String(info.height).padEnd(4)} ${(info.size / 1024).toFixed(0).padStart(5)} Ko`);
}
console.log(`\n${manifeste.length} images, ${(total / 1024 / 1024).toFixed(1)} Mo au total`);

// Aperçu des liens partagés (réseaux sociaux, messageries) : la presse à injecter, recadrée.
const hero = parMedia.get(manifeste.find((i) => i.name === 'hero-injection').media);
await sharp(path.join(dossierOriginaux, hero.fichier))
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(racine, 'public/og-default.jpg'));
console.log('public/og-default.jpg écrit');
