import type { Locale } from '../i18n';

/**
 * Dane firmy — jedyne źródło prawdy dla kontaktu i danych strukturalnych.
 * Docelowo: ten obiekt zostanie wypełniony z CMS (SEO Grow) przez API.
 *
 * ZASADA: nie uzupełniamy danych, których klient nie potwierdził.
 * Tam, gdzie wartość jest do potwierdzenia (forma prawna, certyfikaty,
 * warunki handlowe), zostawiamy jawne oznaczenie „do potwierdzenia"
 * zamiast dopisywać wartość, która mogłaby być fałszywa.
 *
 * NIEPUBLIKOWANE — czeka na potwierdzenie klienta (SEO Grow):
 *   • rok założenia firmy → schema.org `foundingDate` — brak potwierdzenia,
 *   • kod pocztowy → schema.org `address.postalCode` — klient podał tylko
 *     miejscowość (Słonecznik) i miasto (Olsztyn),
 *   • forma prawna → schema.org `legalName` — w JSON-LD trafia nazwa
 *     handlowa „Doors Obłogi", nie nazwa wpisana w KRS.
 */
export const company = {
  name: 'Doors Obłogi',
  /**
   * Nazwa widoczna w znacznikach strukturalnych i w hero.
   * TODO(SEO Grow): potwierdzić formę prawną i NIP — klient nie podał.
   * Do czasu potwierdzenia nie publikujemy tego w JSON-LD.
   */
  legalName: 'Doors Obłogi',
  phoneE164: '+48696741679',
  contactPerson: 'Szymon Małoszek',
  contactPersonRole: {
    pl: 'kontakt handlowy',
    en: 'sales contact',
    de: 'Vertriebskontakt',
  } satisfies Record<Locale, string>,
  region: 'Słonecznik',
  city: 'Olsztyn',
  /** Wariant do wyświetlania — z prefiksem „województwo". */
  voivodeship: {
    pl: 'województwo warmińsko-mazurskie',
    en: 'Warmian-Masurian Voivodeship',
    de: 'Ermland-Masuren',
  } satisfies Record<Locale, string>,
  /** Wariant do schema.org — bez prefiksu („województwo" to nie nazwa regionu). */
  addressRegion: {
    pl: 'warmińsko-mazurskie',
    en: 'Warmian-Masurian Voivodeship',
    de: 'Ermland-Masuren',
  } satisfies Record<Locale, string>,
  country: {
    pl: 'Polska',
    en: 'Poland',
    de: 'Polen',
  } satisfies Record<Locale, string>,
  /**
   * Slogan — dosłowne sformułowanie klienta z Facebooka („Obłóg dębowy,
   * cięty i wędzony"). Wpisujemy je do `Organization.slogan`, bo to
   * jedyna fraza marki, którą da się zweryfikować bez zmyślania.
   */
  slogan: {
    pl: 'Obłóg dębowy, cięty i wędzony',
    en: 'Oak trim battens, cut and smoked',
    de: 'Eichen-Abschlussleisten, geschnitten und geräuchert',
  } satisfies Record<Locale, string>,
  facebookUrl: 'https://www.facebook.com/people/Doors-Ob%C5%82ogi/61557841376445/',
  /** Identyfikator strony Facebook — ten sam co w profilu powyżej. */
  messengerUrl: 'https://m.me/61557841376445',
  /** Tekst alternatywny logo — w brandzie, nie w szablonie (AGENTS.md, pkt 8). */
  logoAlt: {
    pl: 'Doors Obłogi — Naturalny dąb',
    en: 'Doors Obłogi — Natural oak',
    de: 'Doors Obłogi — Natürliche Eiche',
  } satisfies Record<Locale, string>,
  /** Numer w zapisie międzynarodowym (bez +), pod format wa.me. */
  whatsappNumber: '48696741679',
  /**
   * TODO(SEO Grow): potwierdź adres e-mail z klientem — na Facebooku
   * udostępniony jest tylko telefon, więc to adres roboczy witryny.
   * Po podłączeniu CMS ustaw tutaj adres z API.
   */
  contactEmail: 'kontakt@doors-oblogi.pl',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=S%C5%82onecznik%2C%20Olsztyn%2C%20Poland',
  /** Środek transportu: wysyłka kurierem po całej Polsce. */
  shippingNote: {
    pl: 'Wysyłka kurierem na terenie całej Polski',
    en: 'Courier shipping within Poland',
    de: 'Versand per Kurier innerhalb Polens',
  } satisfies Record<Locale, string>,
  /**
   * Poza Polską nie mamy potwierdzonej stałej taryfy — wyceniamy
   * indywidualnie. Nie obiecujemy transportu do UE, tylko wycenę.
   */
  shippingOutside: {
    pl: 'Dostawa poza Polskę — wycena indywidualnie',
    en: 'Shipping outside Poland — quoted individually',
    de: 'Lieferung außerhalb Polens — Angebot auf Anfrage',
  } satisfies Record<Locale, string>,
  /**
   * Profile w sieci społecznościowej → schema.org sameAs.
   * Uzupełniamy tylko profile potwierdzone przez klienta (Facebook).
   */
  profiles: ['https://www.facebook.com/people/Doors-Ob%C5%82ogi/61557841376445/'] as string[],
} as const;

/** Telefon w zapisie zależnym od języka — międzynarodowy poza Polską. */
export function phoneDisplay(locale: Locale): string {
  return locale === 'pl' ? '696 741 679' : '+48 696 741 679';
}

/**
 * Adres w jednym ciągu — ta sama kolejność w stopce, na stronie kontaktu
 * i w bloku NAP. GEO: asystent musi znaleźć identyczny napis w całej witrynie.
 */
export function addressText(locale: Locale): string {
  return `${company.region}, ${company.city}, ${company.voivodeship[locale]}, ${company.country[locale]}`;
}

/**
 * Godziny pracy.
 *
 * KLIENT NIE POTWIERDZIŁ GODZIN. Wcześniejsza wersja strony publikowała
 * „poniedziałek–piątek, 8:00–16:00" oraz to samo w
 * `openingHoursSpecification` — były to wartości oszacowane, nie potwierdzone.
 * Oszacowane godziny podane jako fakty to fałszywy sygnał lokalny w grafe
 * wiedzy Google, więc ich nie publikujemy.
 *
 * TODO(SEO Grow): klient potwierdza godziny → wpisz je w `schedule` i
 * przestaw `confirmed` na `true`. Wtedy wracają automatycznie:
 *   • godziny w bloku kontaktu (`hoursText`),
 *   • `openingHoursSpecification` w `src/content/schema.ts`.
 * Do potwierdzenia strona mówi tylko, że odpowiadamy w godzinach pracy —
 * i to jest prawda.
 */
export const hours = {
  confirmed: false,
  /** Rozkład — do wypełnienia przez klienta. */
  schedule: {
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as string[],
    opens: '08:00',
    closes: '16:00',
  },
  /** Etykieta wiersza w bloku kontaktu. */
  label: {
    pl: 'Odpowiadamy',
    en: 'We reply',
    de: 'Wir antworten',
  } satisfies Record<Locale, string>,
  /** Wartość widoczna na stronie, gdy godziny nie są potwierdzone. */
  unconfirmed: {
    pl: 'W godzinach pracy — najszybciej telefonicznie',
    en: 'During working hours — the phone is fastest',
    de: 'In den Geschäftszeiten — telefonisch am schnellsten',
  } satisfies Record<Locale, string>,
  /** Wartość widoczna na stronie, gdy godziny są potwierdzone. */
  confirmedText: {
    pl: 'Poniedziałek – piątek, 8:00 – 16:00',
    en: 'Monday to Friday, 8:00 – 16:00',
    de: 'Montag bis Freitag, 8:00 – 16:00',
  } satisfies Record<Locale, string>,
};

/** Tekst wiersza „odpowiadamy" — zależny od potwierdzenia godzin. */
export function hoursText(locale: Locale): string {
  return hours.confirmed ? hours.confirmedText[locale] : hours.unconfirmed[locale];
}

/** Link do WhatsAppa z gotową treścią. */
export function whatsappUrl(text: string): string {
  return `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

/**
 * Adres w formie używanej w schema.org i stopce.
 *
 * TODO(SEO Grow): brak potwierdzonego kodu pocztowego — klient podał tylko
 * miejscowość i miasto. `postalCode` celowo nie występuje, dopóki nie
 * potwierdzi; zmyślony kod pocztowy to fałszywy sygnał lokalny.
 */
export function postalAddress(locale: Locale) {
  return {
    // Ulica nie jest znana — „Słonecznik" to nazwa miejscowości, nie ulicy.
    addressLocality: company.region,
    addressRegion: company.addressRegion[locale],
    addressCountry: 'PL',
  };
}
