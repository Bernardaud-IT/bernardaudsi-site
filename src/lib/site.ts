import site from '../content/site.json';

export { site };

export interface Bouton {
  libelle: string;
  href: string;
  style?: 'primaire' | 'secondaire';
}

export interface Page {
  slug: string;
  titre: string;
  titreSeo?: string;
  surtitre?: string;
  sousTitre?: string;
  description: string;
  chapo?: string;
  image?: string;
  /** Page en cours de rédaction : exclue des moteurs de recherche (noindex) tant qu'elle est à true. */
  brouillon?: boolean;
  hero?: {
    surtitre?: string;
    titre: string;
    texte: string;
    boutons: Bouton[];
    image: string;
  };
  blocs: Bloc[];
}

// Les blocs sont décrits dans docs/CONTENUS.md. `type` choisit le rendu (components/Blocs.astro).
export type Bloc = { type: string; [cle: string]: unknown };

const modules = import.meta.glob<{ default: Page }>('../content/fr/**/*.json', { eager: true });

/** Toutes les pages du site, indexées par adresse (« offre/ceramiques-techniques », « » pour l'accueil). */
export const pages: Page[] = Object.values(modules).map((m) => m.default);

export function pageParSlug(slug: string): Page | undefined {
  return pages.find((p) => p.slug === slug);
}

/** Adresse publique d'une page, avec les barres obliques de début et de fin. */
export function urlDe(slug: string): string {
  return slug === '' ? '/' : `/${slug}/`;
}

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/**
 * Préfixe un lien interne par le dossier de publication. Sur bernardaudsi.com le site est à la racine
 * (aucun préfixe) ; l'aperçu GitHub Pages est dans un sous-dossier (SITE_BASE). Les liens externes,
 * mailto:, tel: et ancres sont laissés tels quels.
 */
export function lien(href: string): string {
  return /^(https?:|mailto:|tel:|#)/.test(href) ? href : `${base}${href}`;
}

/** Fil d'Ariane : les pages parentes sont celles dont l'adresse est un préfixe de la page courante. */
export function filAriane(slug: string): { libelle: string; href: string }[] {
  const segments = slug.split('/').filter(Boolean);
  const fil = [{ libelle: 'Accueil', href: '/' }];
  for (let i = 1; i <= segments.length; i++) {
    const page = pageParSlug(segments.slice(0, i).join('/'));
    if (page) fil.push({ libelle: page.titre, href: urlDe(page.slug) });
  }
  return fil;
}
