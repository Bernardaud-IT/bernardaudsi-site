// Menu de navigation : bouton « Menu » sur mobile, sous-menus accessibles au clavier et au toucher.
// Le site reste entièrement utilisable sans ce script (les liens sont de simples liens).

const entete = document.querySelector<HTMLElement>('[data-header]');
const boutonMenu = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const grandEcran = window.matchMedia('(min-width: 1081px)');

function menuOuvert(ouvert: boolean): void {
  if (!entete || !boutonMenu) return;
  entete.toggleAttribute('data-open', ouvert);
  boutonMenu.setAttribute('aria-expanded', String(ouvert));
  // Le fond ne défile plus tant que le menu plein écran est ouvert.
  document.body.classList.toggle('menu-open', ouvert);
}

function fermerSousMenus(sauf?: Element | null): void {
  document.querySelectorAll('.has-sub.is-open').forEach((rubrique) => {
    if (rubrique === sauf) return;
    rubrique.classList.remove('is-open');
    rubrique.querySelector('[data-sub-toggle]')?.setAttribute('aria-expanded', 'false');
  });
}

boutonMenu?.addEventListener('click', () => menuOuvert(!entete?.hasAttribute('data-open')));

document.querySelectorAll<HTMLButtonElement>('[data-sub-toggle]').forEach((bouton) => {
  bouton.addEventListener('click', () => {
    const rubrique = bouton.closest('.has-sub');
    fermerSousMenus(rubrique);
    const ouvert = rubrique?.classList.toggle('is-open') ?? false;
    bouton.setAttribute('aria-expanded', String(ouvert));
  });
});

// Échap ferme les sous-menus et le menu mobile, et rend le focus au bouton concerné.
document.addEventListener('keydown', (evenement) => {
  if (evenement.key !== 'Escape') return;
  const ouvert = document.querySelector('.has-sub.is-open [data-sub-toggle]');
  fermerSousMenus();
  if (ouvert instanceof HTMLElement) ouvert.focus();
  if (entete?.hasAttribute('data-open')) {
    menuOuvert(false);
    boutonMenu?.focus();
  }
});

// Un clic ailleurs referme les sous-menus ouverts.
document.addEventListener('click', (evenement) => {
  if (!(evenement.target instanceof Element) || evenement.target.closest('.has-sub')) return;
  fermerSousMenus();
});

// En repassant sur grand écran, on referme le menu mobile pour ne pas bloquer le défilement.
grandEcran.addEventListener('change', (e) => {
  if (e.matches) menuOuvert(false);
});
