import { getImage } from 'astro:assets';
import { image } from './images';

/**
 * Hero — ta sama ścieżka w trzech miejscach, więc musi mieć JEDEN
 * generator. Wcześniej `src/pages/index.astro` robił swój własny
 * `getImage()` do preloadu, a `HomeView` drugi do znacznika `<img>`: oba
 * dawały 1400 px, ale gdy zmieniłaby się szerokość w jednym miejscu,
 * preload zapowiedziałby inną wersję niż ta, którą przeglądarka pobiera —
 * i LCP znowu płaciłby za podwójne pobranie.
 *
 * Źródło ma 1400 px, więc szerszych wariantów nie ma z czego zrobić —
 * `srcset` sięga do szerokości oryginału i nie upscaluje.
 */

/** Szerokości wariantów hero. Ostatnia = szerokość źródła. */
export const HERO_WIDTHS = [700, 1000, 1400] as const;

/**
 * `sizes` — hero zajmuje całą szerokość okna, więc przeglądarka wybiera
 * wariant po szerokości ekranu, nie po szerokości elementu.
 */
export const HERO_SIZES = '100vw';

export interface HeroImage {
  /** Wariant domyślny (najszerszy) — trafia w `src`. */
  src: string;
  /** Wszystkie warianty jako `srcset`. */
  srcset: string;
  /** `sizes` dla `srcset`. */
  sizes: string;
  /** Szerokość i wysokość w pikselach — zapobiegają layout shift. */
  width: number;
  height: number;
}

/**
 * Zwraca hero gotowy do użycia w `<img>` (`src` + `srcset` + `sizes`) i do
 * `<link rel="preload">` (`href` + `imagesrcset` + `imagesizes`).
 *
 * Wywołujemy to raz w komponencie i raz w stronie, ale z tego samego
 * miejsca — więc oba znaczniki opisują DOKŁADNIE ten sam zestaw plików.
 */
export async function heroImage(): Promise<HeroImage> {
  const src = image('hero-sufit-dab.jpg');

  const variants = await Promise.all(
    HERO_WIDTHS.map(async (width) => ({
      width,
      file: await getImage({ src, width, format: 'webp' }),
    })),
  );

  const largest = variants[variants.length - 1].file;

  return {
    src: largest.src,
    srcset: variants.map((v) => `${v.file.src} ${v.width}w`).join(', '),
    sizes: HERO_SIZES,
    width: largest.attributes.width ?? src.width,
    height: largest.attributes.height ?? src.height,
  };
}
