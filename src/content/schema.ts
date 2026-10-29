import { company, postalAddress, hours } from './company';
import { pricing } from './pricing';
import { products, type Product } from './products';
import { terms } from './terms';
import { definition } from './definitions';
import { productPath, localeInfo, type Locale } from '../i18n';

const site = 'https://doors-oblogi.pl';

/**
 * Kontekst schema.org. Bez niego parser musi zgadywać, że chodzi o schema.org
 * (JSON-LD 1.0 zakłada to domyślnie, ale JSON-LD 1.1 już nie) — i Google
 * zgłasza w Structured Data Testera brak `@context`.
 */
export const SCHEMA_CONTEXT = 'https://schema.org';

/** Ścieżka do obrazu OG dla danego języka (pliki w `public/og/`). */
export function ogImagePath(locale: Locale): string {
  return `/og/doors-oblogi-${locale}.jpg`;
}

/** Bezwzględny URL obrazu OG. */
export function ogImageUrl(locale: Locale): string {
  return `${site}${ogImagePath(locale)}`;
}

/**
 * Schema.org Product dla strony produktu.
 *
 * `imageUrl` i `productUrl` podaje widok — dzięki temu URL jest absolutny
 * i wskazuje na realnie istniejący plik po `astro:assets`.
 */
export function productSchema(
  product: Product,
  locale: Locale,
  imageUrl: string,
  productUrl: string,
) {  const price = pricing[product.id];
  const category =
    locale === 'pl' ? 'Obłogi dębowe' : locale === 'en' ? 'Oak trim battens' : 'Eichen-Abschlussleisten';
  const material =
    locale === 'pl' ? 'Naturalny dąb' : locale === 'en' ? 'Natural oak' : 'Natürliche Eiche';

  const additionalProperty = product.specs.map((spec) => ({
    '@type': 'PropertyValue',
    name: spec.label[locale],
    value: spec.value[locale],
  }));

  if (price) {
    additionalProperty.push({
      '@type': 'PropertyValue',
      name: locale === 'pl' ? 'Jednostka sprzedaży' : locale === 'en' ? 'Sales unit' : 'Verkaufseinheit',
      value: price.unit[locale],
    });
    additionalProperty.push({
      '@type': 'PropertyValue',
      name: locale === 'pl' ? 'Od czego zależy cena' : locale === 'en' ? 'What the price depends on' : 'Wovon der Preis abhängt',
      value: price.factors[locale],
    });
  }

  // Cena zależy od wymiarów i ilości — wyceny są indywidualne, więc schema.org
  // deklaruje jednostkę i walutę, a nie zmyśloną kwotę. Gdy klient opublikuje
  // cennik (`pricing[...].published`), dochodzą `price` / `minPrice` / `maxPrice`.
  const published = price?.published;
  const priceSpecification: Record<string, unknown> = {
    '@type': 'PriceSpecification',
    priceCurrency: published?.currency ?? 'PLN',
  };
  if (price) {
    priceSpecification.unitCode = price.unitCode;
    priceSpecification.unitText = price.unit[locale];
  }
  if (published) {
    priceSpecification.price = published.min;
    priceSpecification.minPrice = published.min;
    priceSpecification.maxPrice = published.max;
  }

  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Product',
    '@id': `${productUrl}#product`,
    name: product.name[locale],
    description: product.summary[locale],
    image: [imageUrl, ogImageUrl(locale)],
    url: productUrl,
    sku: product.id,
    mpn: product.id,
    category,
    material,
    color: product.color[locale],
    size: product.size[locale],
    brand: { '@type': 'Brand', name: company.name },
    manufacturer: { '@id': `${site}#organization` },
    additionalProperty,
    offers: {
      '@type': 'Offer',
      '@id': `${productUrl}#offer`,
      // Produkt powstaje na wymiar — nie trzymamy go w magazynie.
      // `MadeToOrder` opisuje to dokładnie; `PreOrder` sugerowałby, że
      // czekamy na dostawcę, a nie że sami go wycinamy.
      availability: 'https://schema.org/MadeToOrder',
      itemCondition: 'https://schema.org/NewCondition',
      priceCurrency: published?.currency ?? 'PLN',
      url: productUrl,
      seller: { '@id': `${site}#organization` },
      businessFunction: 'https://schema.org/Sell',
      priceSpecification,
    },
  };
}

/**
 * `DefinedTerm` — pojęcie, które strona definiuje.
 *
 * Bez tego asystent (ChatGPT, Perplexity, Gemini) nie ma struktury, do
 * której mógłby przyczepić definicję „obłóg dębowy". Definicja w tekście
 * strony to jedno; w grafie wiedzy to drugie — i obie muszą być takie same.
 *
 * `description` bierze `definition.oneLiner` — dokładnie to zdanie, które
 * widać na stronie i które cytuje `llms.txt`. Jedna definicja, trzy miejsca.
 *
 * `inDefinedTermSet` wskazuje na zestaw pojęć firmy (`#definedterms`), żeby
 * Google mógł powiązać pojęcie z organizacją, a nie z przypadkową stroną.
 */
export function definedTermSchema(locale: Locale) {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'DefinedTerm',
    '@id': `${site}#definedterm-${locale}`,
    name: definition.term[locale],
    description: definition.oneLiner[locale],
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      '@id': `${site}#definedterms`,
      name:
        locale === 'pl'
          ? 'Pojęcia materiałowe Doors Obłogi'
          : locale === 'en'
            ? 'Doors Obłogi material terms'
            : 'Materialbegriffe von Doors Obłogi',
      url: `${site}/`,
    },
    url: `${site}/`,
    inLanguage: localeInfo[locale].htmlLang,
  };
}

/**
 * Organization / LocalBusiness — dane firmy dla wyszukiwarek.
 *
 * UWAGA: `geo` (współrzędne GPS) celowo pomijamy — klient nie podał
 * współrzędnych pracowni, a zmyślone współrzędne byłyby fałszywym
 * sygnałem lokalnym. Uzupełni je po potwierdzeniu adresu.
 */
export function organizationSchema(locale: Locale) {
  const areaServed = [
    { '@type': 'Country', name: company.country[locale] },
    {
      '@type': 'AdministrativeArea',
      name:
        locale === 'pl'
          ? 'województwo warmińsko-mazurskie'
          : locale === 'en'
            ? 'Warmian-Masurian Voivodeship'
            : 'Ermland-Masuren',
    },
    { '@type': 'City', name: 'Olsztyn' },
  ];

  /**
   * `priceRange` ma sens tylko wtedy, gdy klient faktycznie opublikuje ceny.
   * Do tej pory cennik jest na zapytanie, więc zakres cen by był zmyślony —
   * a Google używa `priceRange` do odznak w pakiecie lokalnym.
   * Gdy `pricing[...].published` się pojawi, zakres liczy się sam.
   */
  const publishedPrices = Object.values(pricing)
    .map((entry) => entry?.published)
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  const priceRange = publishedPrices.length
    ? `${Math.min(...publishedPrices.map((entry) => entry.min))}–${Math.max(
        ...publishedPrices.map((entry) => entry.max),
      )} ${publishedPrices[0].currency}`
    : undefined;

  /**
   * Forma płatności. W `src/content/terms.ts` klient **jeszcze nie potwierdził**
   * formy płatności (`confirmed: false` — ustalana w wycenie). Schemat nie może
   * twierdzić więcej niż strona, więc `paymentAccepted` pojawia się dopiero
   * po potwierdzeniu. Bez tego układałoby się to z jednej strony, a z drugiej
   * przeczyło.
   */
  const paymentRow = terms.rows.find((row) => row.label.en === 'Payment');
  const paymentConfirmed = paymentRow?.confirmed === true;

  return {
    '@context': SCHEMA_CONTEXT,
    '@type': ['Organization', 'LocalBusiness'],
    '@id': `${site}#organization`,
    name: company.name,
    url: `${site}/`,
    slogan: company.slogan[locale],
    /**
     * `logo` to logo, nie karta social. `public/images/logo-web.webp` to
     * prawdziwy znak (900×209, oba wymiary >112 px, które wymaga Google);
     * `og-default.png` (1200×630) zostaje jako `image`.
     */
    logo: `${site}/images/logo-web.webp`,
    image: `${site}/og-default.png`,
    email: company.contactEmail,
    telephone: company.phoneE164,
    /**
     * Punkt kontaktu — to, czego szuka asystent odpowiadający na pytanie
     * „jak się z wami skontaktować". Dane są te same, co w bloku NAP na
     * stronie kontaktu.
     */
    contactPoint: [
      {
        '@type': 'ContactPoint',
        '@id': `${site}#contactpoint`,
        name: company.contactPerson,
        telephone: company.phoneE164,
        contactType: 'sales',
        areaServed: 'PL',
        availableLanguage: (['pl', 'en', 'de'] as Locale[]).map((l) => localeInfo[l].htmlLang),
      },
    ],
    // `foundingDate`, `legalName` i `address.postalCode` celowo pomijamy —
    // klient ich nie potwierdził (patrz TODO w src/content/company.ts).
    description:
      locale === 'pl'
        ? 'Producent obłogów dębowych, lameli dębowych oraz gotowych paneli sufitowych i ściennych. Produkcja w Słoneczniku k. Olsztyna, wysyłka kurierem w całej Polsce.'
        : locale === 'en'
          ? 'Manufacturer of oak trim battens, oak battens and ready-made ceiling and wall panels. Production in Słonecznik near Olsztyn, courier delivery within Poland.'
          : 'Hersteller von Eichen-Abschlussleisten, Eichenlamellen sowie fertigen Decken- und Wandpaneelen. Produktion in Słonecznik bei Olsztyn, Versand per Kurier innerhalb Polens.',
    address: {
      '@type': 'PostalAddress',
      ...postalAddress(locale),
    },
    areaServed,
    knowsAbout:
      locale === 'pl'
        ? ['Obłogi dębowe', 'Lamele dębowe', 'Panele sufitowe z dębu', 'Dąb wędzony', 'Boazeria dębowa']
        : locale === 'en'
          ? ['Oak trim battens', 'Oak battens', 'Oak ceiling panels', 'Smoked oak', 'Oak cladding']
          : ['Eichen-Abschlussleisten', 'Eichenlamellen', 'Eichen-Deckenpaneele', 'Geräucherte Eiche', 'Eichen-Verkleidung'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name:
        locale === 'pl'
          ? 'Oferta obłogów dębowych'
          : locale === 'en'
            ? 'Oak trim batten range'
            : 'Sortiment der Eichen-Abschlussleisten',
      itemListElement: products.map((product) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: product.name[locale],
          url: `${site}${productPath(locale, product.slug[locale])}`,
          // Obraz konkretnego produktu (`public/og/<id>-<locale>.jpg`), a nie
          // karta języka — inaczej cztery pozycje katalogu wyglądają identycznie.
          image: `${site}/og/${product.id}-${locale}.jpg`,
          brand: { '@type': 'Brand', name: company.name },
        },
        url: `${site}${productPath(locale, product.slug[locale])}`,
        priceCurrency: 'PLN',
        availability: 'https://schema.org/MadeToOrder',
        businessFunction: 'https://schema.org/Sell',
      })),
    },
    // Ceny nie są publikowane — wyceny są indywidualne.
    ...(priceRange ? { priceRange } : {}),
    currenciesAccepted: 'PLN',
    // Metoda płatności, nie zdanie — warunki i wyjątki klient potwierdza
    // w wycenie (widoczne w `src/content/terms.ts`). Dopóki nie potwierdzone,
    // schemat nie deklaruje niczego: patrz `paymentConfirmed` wyżej.
    ...(paymentConfirmed
      ? {
          paymentAccepted:
            locale === 'pl'
              ? 'Przelew, Faktura'
              : locale === 'en'
                ? 'Bank transfer, Invoice'
                : 'Überweisung, Rechnung',
        }
      : {}),
    /**
     * Godziny otwarcia — tylko potwierdzone.
     * Klient ich nie podał, a oszacowane godziny podane jako fakt tworzą
     * fałszywy sygnał w grafe wiedzy. Wystarczy przestawić `hours.confirmed`
     * w `src/content/company.ts` i pole wraca razem z godzinami na stronie.
     */
    ...(hours.confirmed
      ? {
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: hours.schedule.dayOfWeek,
              opens: hours.schedule.opens,
              closes: hours.schedule.closes,
            },
          ],
        }
      : {}),
    sameAs: company.profiles,
  };
}
