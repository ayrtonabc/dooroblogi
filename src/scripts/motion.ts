/**
 * Única animación de la web: el titular del hero, palabra a palabra.
 *
 * Decisión del cliente: fuera las animaciones de los títulos de sección y
 * fuera todo el movimiento ligado al scroll. Sólo queda el gesto de entrada
 * del hero. Por eso este módulo NO importa ScrollTrigger: pesa menos y no
 * puede engancharse al scroll por accidente.
 *
 * Reglas:
 *   • Si el JS no llega, el titular se ve entero: la animación sólo envuelve
 *     palabras cuando el script ya está ejecutándose.
 *   • Con `prefers-reduced-motion: reduce` no se toca el DOM.
 */
import gsap from 'gsap';

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function revealHeroTitle() {
  if (reduce) return;
  const title = document.querySelector<HTMLElement>('.hero [data-anim-headline]');
  if (!title) return;

  const words = (title.textContent || '').trim().split(/\s+/);
  title.textContent = '';

  const inners: HTMLElement[] = [];
  words.forEach((word, index) => {
    const wrap = document.createElement('span');
    wrap.className = 'anim-word';

    const inner = document.createElement('span');
    inner.className = 'anim-word__inner';
    inner.textContent = word;

    wrap.appendChild(inner);
    title.appendChild(wrap);
    if (index < words.length - 1) title.appendChild(document.createTextNode(' '));
    inners.push(inner);
  });

  gsap.fromTo(
    inners,
    { yPercent: 110, opacity: 0 },
    {
      yPercent: 0,
      opacity: 1,
      duration: 1.05,
      ease: 'expo.out',
      stagger: 0.05,
      delay: 0.15,
    },
  );
}

revealHeroTitle();
