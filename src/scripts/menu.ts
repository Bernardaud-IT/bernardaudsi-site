// Menu de navigation : bouton « Menu » sur mobile, sous-menus accessibles à la souris, au clavier et au toucher.
// Le site reste entièrement utilisable sans ce script (les liens sont de simples liens, et le CSS affiche les
// sous-menus au survol et au focus tant que la classe « js » n'est pas posée).

const entete = document.querySelector<HTMLElement>('[data-header]');
const boutonMenu = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const grandEcran = window.matchMedia('(min-width: 1081px)');
// Quand le menu mobile est ouvert, le reste de la page est rendu « inerte » : le focus clavier et les lecteurs d'écran
// ne peuvent plus en sortir par accident (équivalent d'un piège à focus, sans code fragile).
const zonesInertes = document.querySelectorAll<HTMLElement>('main, footer, .skip-link');

function menuOuvert(ouvert: boolean): void {
  if (!entete || !boutonMenu) return;
  entete.toggleAttribute('data-open', ouvert);
  boutonMenu.setAttribute('aria-expanded', String(ouvert));
  zonesInertes.forEach((zone) => zone.toggleAttribute('inert', ouvert));
  // Le fond ne défile plus tant que le menu plein écran est ouvert.
  document.body.classList.toggle('menu-open', ouvert);
}

function sousMenuOuvert(rubrique: Element, ouvert: boolean): void {
  rubrique.classList.toggle('is-open', ouvert);
  rubrique.querySelector('[data-sub-toggle]')?.setAttribute('aria-expanded', String(ouvert));
}

function fermerSousMenus(sauf?: Element | null): void {
  document.querySelectorAll('.has-sub.is-open').forEach((rubrique) => {
    if (rubrique !== sauf) sousMenuOuvert(rubrique, false);
  });
}

boutonMenu?.addEventListener('click', () => menuOuvert(!entete?.hasAttribute('data-open')));

document.querySelectorAll('.has-sub').forEach((rubrique) => {
  const bascule = rubrique.querySelector<HTMLButtonElement>('[data-sub-toggle]');

  // Toucher ou clic sur la flèche : ouvre ou ferme le sous-menu.
  bascule?.addEventListener('click', () => {
    fermerSousMenus(rubrique);
    sousMenuOuvert(rubrique, !rubrique.classList.contains('is-open'));
  });

  // Souris (grand écran) : ouvert à l'entrée, refermé à la sortie. Le type de pointeur évite que le « survol » simulé
  // par un appui tactile n'ouvre puis ne referme aussitôt le sous-menu.
  rubrique.addEventListener('pointerenter', (e) => {
    if (!grandEcran.matches || (e as PointerEvent).pointerType !== 'mouse') return;
    fermerSousMenus(rubrique);
    sousMenuOuvert(rubrique, true);
  });
  rubrique.addEventListener('pointerleave', (e) => {
    if (!grandEcran.matches || (e as PointerEvent).pointerType !== 'mouse') return;
    if (!rubrique.contains(document.activeElement)) sousMenuOuvert(rubrique, false);
  });

  // Clavier (grand écran) : le focus sur le lien ou sur un lien du sous-menu l'ouvre, en sortir le ferme.
  rubrique.addEventListener('focusin', (e) => {
    if (!grandEcran.matches || (e.target as Element).closest('[data-sub-toggle]')) return;
    fermerSousMenus(rubrique);
    sousMenuOuvert(rubrique, true);
  });
  rubrique.addEventListener('focusout', (e) => {
    if (!grandEcran.matches) return;
    if (!rubrique.contains((e as FocusEvent).relatedTarget as Node | null)) sousMenuOuvert(rubrique, false);
  });
});

// Échap ferme les sous-menus et le menu mobile, et rend le focus au bouton concerné (WCAG 1.4.13).
document.addEventListener('keydown', (evenement) => {
  if (evenement.key !== 'Escape') return;
  const ouvert = document.querySelector('.has-sub.is-open .nav-link');
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
