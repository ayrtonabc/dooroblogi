import type { ImageMetadata } from 'astro';

/**
 * Wszystkie zdjęcia pochodzą z publicznego profilu Facebook klienta.
 * Trzymamy je w `src/assets`, żeby Astro wygenerował poprawne `srcset`
 * i znał wymiary obrazu (layout shift = 0).
 */
import dabWedzonyBeczka from '../assets/images/dab-wedzony-beczka.jpg';
import dabZSakami from '../assets/images/dab-z-sakami.jpg';
import deskaDebowa from '../assets/images/deska-debowa-naturalna.jpg';
import deskiNaPlacu from '../assets/images/deski-na-placu.jpg';
import deskiZSakami from '../assets/images/deski-z-sakami.jpg';
import hero from '../assets/images/hero-oblog-debowy.jpg';
import heroCeiling from '../assets/images/hero-sufit-dab.jpg';
import serviceSchody from '../assets/images/service-schody-stock.jpg';
import oblogNaDesce from '../assets/images/oblog-na-desce.jpg';
import oblogWHali from '../assets/images/oblog-w-hali.jpg';
import oblogWScianie from '../assets/images/oblog-w-scianie.jpg';
import oblogWedzony from '../assets/images/oblog-wedzony.jpg';
import paneleScienne from '../assets/images/panele-scienne-dab.jpg';
import pomiarOblogu from '../assets/images/pomiar-oblogu.jpg';
import profil from '../assets/images/profil-oblogu.jpg';
import sedoWarianty from '../assets/images/sedo-warianty.png';
import sedoBezSedkow from '../assets/images/sedo-bez-sedkow.jpg';
import sedoZSedkami from '../assets/images/sedo-z-sedkami.jpg';
import sufitSedo from '../assets/images/sufit-sedo-realny.jpg';

export const images = {
  'hero-oblog-debowy.jpg': hero,
  /**
   * Fondo del hero: macro del grano de roble.
   *
   * OJO — desviación consciente de la regla 2 de AGENTS.md (las fotos son
   * del cliente y no se sustituyen). Esta imagen la aporta el cliente desde
   * una URL externa; queda pendiente de que la confirme como propia. Si se
   * sustituye, hay que regenerar la máscara de vetas con
   * `npm run grain <ruta>` para que la luz siga el grano correcto.
   */
  'hero-sufit-dab.jpg': heroCeiling,
  /*
   * PROVISIONAL — foto de stock (Pexels, licencia de uso comercial) para el
   * bloque de servicios mientras el cliente no envíe la suya de escaleras.
   *   service-schody-stock.jpg  → https://www.pexels.com/photo/38785707/
   * El techo ya tiene foto propia del cliente (`sufit-sedo-realny.jpg`).
   */
  'service-schody-stock.jpg': serviceSchody,
  'oblog-na-desce.jpg': oblogNaDesce,
  'profil-oblogu.jpg': profil,
  'oblog-w-scianie.jpg': oblogWScianie,
  'deska-debowa-naturalna.jpg': deskaDebowa,
  'dab-z-sakami.jpg': dabZSakami,
  'panele-scienne-dab.jpg': paneleScienne,
  'oblog-wedzony.jpg': oblogWedzony,
  'dab-wedzony-beczka.jpg': dabWedzonyBeczka,
  /*
   * FOTOS NUEVAS DEL CLIENTE (28/10). La web ya no usa el gráfico antiguo
   * de SEDO (`wspolpraca-sedo.webp`, sigue en el repo por si hay que
   * volver atrás): el cliente mandó la versión limpia, en el mismo tono que
   * la web.
   */
  'sedo-warianty.png': sedoWarianty,
  /** Techo de roble montado, con focos: foto de una instalación real. */
  'sufit-sedo-realny.jpg': sufitSedo,
  /**
   * Los dos recortes del gráfico de SEDO, sin el rótulo impreso: son las
   * fotos del material que usa la maqueta de las dos selecciones.
   */
  'sedo-bez-sedkow.jpg': sedoBezSedkow,
  'sedo-z-sedkami.jpg': sedoZSedkami,
  /** Obłogi apilados en la hala, con el perfil y la krawędź a la vista. */
  'oblog-w-hali.jpg': oblogWHali,
  /** Tabla de roble con cinta métrica: el corte a medida, en la foto. */
  'pomiar-oblogu.jpg': pomiarOblogu,
  /** Desks apiladas en el patio, con los troncos al fondo. */
  'deski-na-placu.jpg': deskiNaPlacu,
  /** Dos tablas de roble con sęki. */
  'deski-z-sakami.jpg': deskiZSakami,
} satisfies Record<string, ImageMetadata>;

export type ImageName = keyof typeof images;

export function image(name: string): ImageMetadata {
  const found = images[name as ImageName];
  if (!found) {
    throw new Error(`Brak zdjęcia w src/assets/images: ${name}`);
  }
  return found;
}
