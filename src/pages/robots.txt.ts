import type { APIRoute } from 'astro';

// En production : tout est exploré et le plan du site est annoncé.
// Aperçu de validation (PUBLIC_MODE_APERCU=1) : aucun moteur de recherche n'a à l'explorer.
export const GET: APIRoute = ({ site }) => {
  const apercu = import.meta.env.PUBLIC_MODE_APERCU === '1';
  const corps = apercu
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${new URL(`${import.meta.env.BASE_URL}sitemap-index.xml`, site).href}\n`;
  return new Response(corps, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
