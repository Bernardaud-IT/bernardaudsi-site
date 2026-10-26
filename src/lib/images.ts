import type { ImageMetadata } from 'astro';
import manifeste from '../content/images.json';

// Toutes les photos optimisées par scripts/images/prepare.mjs, chargées au moment de la construction.
const fichiers = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.webp', { eager: true });

export interface Photo {
  src: ImageMetadata;
  alt: string;
  credit: string | null;
}

/** Retrouve une photo par son nom (voir src/content/images.json). Échoue à la construction si elle n'existe pas. */
export function photo(nom: string): Photo {
  const entree = manifeste.find((i) => i.name === nom);
  const module = fichiers[`../assets/photos/${nom}.webp`];
  if (!entree || !module) {
    throw new Error(`Photo « ${nom} » introuvable : l'ajouter à src/content/images.json puis lancer « npm run images ».`);
  }
  return { src: module.default, alt: entree.alt, credit: entree.credit };
}

/** Crédits à afficher dans les mentions légales : un crédit, la liste des photos concernées. */
export function credits(): { credit: string; photos: string[] }[] {
  const parCredit = new Map<string, string[]>();
  for (const image of manifeste) {
    if (!image.credit) continue;
    parCredit.set(image.credit, [...(parCredit.get(image.credit) ?? []), image.alt]);
  }
  return [...parCredit.entries()].map(([credit, photos]) => ({ credit, photos }));
}
