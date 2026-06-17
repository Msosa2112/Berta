import { useEffect } from 'react';

/**
 * useScrollReveal — F5 Design Spells
 * Observa todos los elementos .reveal dentro del DOM y les añade
 * la clase .visible cuando entran en el viewport.
 */
export function useScrollReveal(deps = []) {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
    );

    // Pequeño delay para que el DOM esté pintado tras el cambio de vista
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach((el) => {
        io.observe(el);
      });
    }, 60);

    return () => {
      clearTimeout(timer);
      io.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
