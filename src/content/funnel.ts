import type { Locale, RouteKey } from '../i18n';
import { pathFor } from '../i18n';
import { company } from './company';

/**
 * EMBUDO DE VENTA — jedno źródło prawdy o etapach, akcjach i mikrocopy.
 *
 * STRUKTURA EMBUDU (docs/ESTRATEGIA.md, §3):
 *   1 ATRACCIÓN     → obietnica + zrobiony efekt      CTA: zobacz produkt
 *   2 EDUCACIÓN     → co to jest, co dostajesz        CTA: chcę wycenę
 *   3 CONSIDERACIÓN → liczby, terminy, warunki        CTA: poproś o cennik
 *   4 CONVERSIÓN    → jedna akcja, bez tarcia         CTA: wyślij zapytanie
 *   5 RETENCJA      → rozwiązane wątpliwości, kolejny krok CTA: napisz na WhatsApp
 *
 * REGULA ZŁOTA (§3): CTA pierwotne strony głównej i każdej strony produktu
 * prowadzą do TEJ SAMEJ akcji — poproć o wycenę. Dlatego `primary` niemal
 * wszędzie prowadzi do formularza wyceny, a różnicę robi `secondary`.
 *
 * REGULA MIKROCOPY (§6): tylko to, co da się dotrzymać.
 *   ✔ "Przygotujemy indywidualną wycenę z terminem realizacji"  — to robią.
 *   ✔ "Bez zobowiązań"                       — zapytanie nie jest zamówieniem.
 *   ✔ "Odpowiadamy e-mailem"                — prawda.
 *   ✘ "Odpowiadamy w 24 h" / "najlepsza cena" / "wysyłka w 24 h" / "gwarancja"
 *     — żadna z tych rzeczy nie jest potwierdzona, więc ich tu nie ma.
 *
 * Brakujące dane handlowe (minimalne zamówienie, termin, próbka, faktura,
 * tolerancje) NIE są zgadywane — są oznaczone jako „potwierdzamy w wycenie"
 * i wypisane w `src/content/terms.ts`. Miejsca na dane od klienta są opisane
 * w sekcji `PENDIENTES` na końcu pliku.
 *
 * Ten moduł nie zawiera żadnego tekstu widocznego poza PL/EN/DE i nie ma
 * literali w komponentach: komponenty czytają wyłącznie stąd.
 */

/** Tekst w trzech językach — lokalny typ, żeby moduł nie zależał od `products.ts`. */
export type FunnelText = Record<Locale, string>;

/** Etapy lejka. */
export type FunnelStage =
  | 'attraction'
  | 'education'
  | 'consideration'
  | 'conversion'
  | 'retention';

/** Dokąd prowadzi akcja. */
export type ActionTarget =
  /** Strona wewnętrzna — ścieżka zależy od języka. */
  | { type: 'route'; route: RouteKey }
  /** Adres zewnętrzny (np. mapa, Facebook). */
  | { type: 'url'; url: string }
  /** Telefon. */
  | { type: 'tel'; number: string }
  /** WhatsApp — treść wiadomości jest wypełniona od razu. */
  | { type: 'whatsapp'; text: FunnelText };

export interface FunnelAction {
  /** Etykieta przycisku. */
  label: FunnelText;
  /** Cel. */
  target: ActionTarget;
  /** Krótka notatka pod przyciskiem — najwyżej jedno zdanie. */
  note?: FunnelText;
}

/**
 * Rozwiązuje akcję do adresu w danym języku.
 */
export function actionHref(locale: Locale, action: FunnelAction): string {
  const target = action.target;
  switch (target.type) {
    case 'route':
      // La CTA de cotización lleva ancla al formulario: el usuario aterriza
      // en el formulario, no en la cabecera de la página de precios.
      return target.route === 'quote'
        ? `${pathFor(locale, target.route)}#quote-form`
        : pathFor(locale, target.route);
    case 'url':
      return target.url;
    case 'tel':
      return `tel:${target.number}`;
    case 'whatsapp':
      return `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(
        target.text[locale],
      )}`;
  }
}

/**
 * Przyjmuje tekst albo gotowy tekst w trzech językach i zwraca wersję
 * dla bieżącego języka. Komponenty używają tego, żeby prop mógł być
 * albo napisem (`"Kontakt"`), albo obiektem z `pl`/`en`/`de`.
 */
export function pick(value: string | FunnelText, locale: Locale): string {
  return typeof value === 'string' ? value : value[locale];
}

/**
 * Wiadomość WhatsApp wypełniona od razu — to prawdziwy kanał klienta.
 *
 * MUSI być zadeklarowana PRZED `funnelStages`: ten obiekt czyta ją wprost
 * (etap `retention`). W buildzie Rollup potrafi przestawić deklarację
 * i błąd znika, ale w dev (moduły ESM 1:1) kończyło się to błędem TDZ
 * „Cannot access 'waPrefill' before initialization" i stroną 500.
 */
export const waPrefill: FunnelText = {
  pl: 'Cześć, chciałbym zapytać o wycenę obłogów dębowych. Podam profil, wymiary i ilość.',
  en: 'Hello, I would like to ask for a quote for oak trim battens. I will give the profile, the dimensions and the quantity.',
  de: 'Hallo, ich möchte ein Angebot für Eichen-Abschlussleisten anfragen. Ich nenne Profil, Maße und Menge.',
};

/* ------------------------------------------------------------------ *
 * Katalog etapów — co obiecuje każdy etap i jakie jest jego działanie.
 * ------------------------------------------------------------------ */

export interface FunnelStageInfo {
  stage: FunnelStage;
  /** Nazwa etapu — do użycia w interfejsie (np. w stopce, w logu). */
  name: FunnelText;
  /** Obietnica etapu — jedno zdanie. */
  promise: FunnelText;
  /** Działanie etapu — pojedyncza akcja. */
  action: FunnelAction;
}

export const funnelStages: Record<FunnelStage, FunnelStageInfo> = {
  attraction: {
    stage: 'attraction',
    name: { pl: 'Przyciągnięcie', en: 'Attraction', de: 'Gewinnung' },
    promise: {
      pl: 'Gotowe wnętrze, nie opis drewna.',
      en: 'A finished room, not a description of wood.',
      de: 'Ein fertiger Raum, keine Beschreibung von Holz.',
    },
    action: {
      label: { pl: 'Zobacz produkty', en: 'See the products', de: 'Produkte ansehen' },
      target: { type: 'route', route: 'catalog' },
    },
  },
  education: {
    stage: 'education',
    name: { pl: 'Edukacja', en: 'Education', de: 'Aufklärung' },
    promise: {
      pl: 'Profil, selekcja drewna, wykończenie. Wiesz, co dostajesz.',
      en: 'Profile, wood selection, finish. You know what arrives.',
      de: 'Profil, Holzselektion, Oberfläche. Sie wissen, was ankommt.',
    },
    action: {
      label: { pl: 'Zapytaj o wycenę', en: 'Request a quote', de: 'Angebot anfordern' },
      target: { type: 'route', route: 'quote' },
    },
  },
  consideration: {
    stage: 'consideration',
    name: { pl: 'Rozważanie', en: 'Consideration', de: 'Abwägung' },
    promise: {
      pl: 'Liczby, terminy i warunki. Potrzebne do decyzji.',
      en: 'Numbers, lead times and terms. What you need to decide.',
      de: 'Zahlen, Lieferzeiten und Bedingungen. Für die Entscheidung.',
    },
    action: {
      label: { pl: 'Poproś o cennik', en: 'Ask for the price list', de: 'Preisliste anfordern' },
      target: { type: 'route', route: 'quote' },
    },
  },
  conversion: {
    stage: 'conversion',
    name: { pl: 'Konwersja', en: 'Conversion', de: 'Konversion' },
    promise: {
      pl: 'Jedno zapytanie. Resztę doprecyzujemy w odpowiedzi.',
      en: 'One enquiry. We clarify the rest in the reply.',
      de: 'Eine Anfrage. Den Rest klären wir in der Antwort.',
    },
    action: {
      label: { pl: 'Wyślij zapytanie', en: 'Send the enquiry', de: 'Anfrage senden' },
      target: { type: 'route', route: 'quote' },
    },
  },
  retention: {
    stage: 'retention',
    name: { pl: 'Utrzymanie', en: 'Retention', de: 'Bindung' },
    promise: {
      pl: 'Wątpliwości rozwiązane tutaj. Dalej — WhatsApp albo telefon.',
      en: 'Your questions are answered here. Next step — WhatsApp or a call.',
      de: 'Fragen werden hier geklärt. Weiter — WhatsApp oder ein Anruf.',
    },
    action: {
      label: { pl: 'Napisz na WhatsApp', en: 'Message on WhatsApp', de: 'Per WhatsApp schreiben' },
      target: { type: 'whatsapp', text: waPrefill },
    },
  },
};

/* ------------------------------------------------------------------ *
 * Akcje współdzielone.
 * ------------------------------------------------------------------ */

const quoteAction: FunnelAction = {
  label: { pl: 'Zapytaj o wycenę', en: 'Request a quote', de: 'Angebot anfordern' },
  target: { type: 'route', route: 'quote' },
};

const priceListAction: FunnelAction = {
  label: { pl: 'Poproś o cennik', en: 'Ask for the price list', de: 'Preisliste anfordern' },
  target: { type: 'route', route: 'quote' },
};

const callAction: FunnelAction = {
  label: { pl: 'Zadzwoń', en: 'Call us', de: 'Anrufen' },
  target: { type: 'tel', number: company.phoneE164 },
};

const whatsappAction: FunnelAction = {
  label: { pl: 'Napisz na WhatsApp', en: 'Message on WhatsApp', de: 'Per WhatsApp schreiben' },
  target: { type: 'whatsapp', text: waPrefill },
};

/* ------------------------------------------------------------------ *
 * Etap i akcja każdej strony.
 * ------------------------------------------------------------------ */

export type FunnelPageKey =
  | 'home'
  | 'catalog'
  | 'product'
  | 'about'
  | 'gallery'
  | 'delivery'
  | 'priceList'
  | 'trade'
  | 'contact';

export interface PageFunnel {
  /** Etap lejka (ESTRATEGIA §3). */
  stage: FunnelStage;
  /** Tytuł CTA — z korzyścią, nigdy „Kontaktuj się". */
  title: FunnelText;
  /** Jedno zdanie pod tytułem. */
  text: FunnelText;
  /** Jedyny CTA pierwotny strony. */
  primary: FunnelAction;
  /** CTA wtórny (telefon / WhatsApp / sąsiednia strona). */
  secondary: FunnelAction;
  /** Mikrocopy pod przyciskiem — obietnica, którą da się dotrzymać. */
  microcopy: FunnelText;
}

export const funnelPages: Record<FunnelPageKey, PageFunnel> = {
  home: {
    stage: 'attraction',
    title: {
      pl: 'Powiedz, co chcesz zrobić z drewnem',
      en: 'Tell us what you want to build with wood',
      de: 'Sagen Sie uns, was Sie aus Holz bauen wollen',
    },
    text: {
      pl: 'Wymiary, zastosowanie, ilość — przygotujemy indywidualną wycenę.',
      en: 'Dimensions, application, quantity — we will prepare an individual quote.',
      de: 'Maße, Anwendung, Menge — wir erstellen ein individuelles Angebot.',
    },
    primary: quoteAction,
    secondary: {
      label: { pl: 'Zobacz produkty', en: 'See the products', de: 'Produkte ansehen' },
      target: { type: 'route', route: 'catalog' },
    },
    microcopy: {
      pl: 'Przygotujemy indywidualną wycenę z terminem realizacji. Bez zobowiązań.',
      en: 'We will prepare an individual quote with the lead time. No commitment.',
      de: 'Wir erstellen ein individuelles Angebot mit Lieferzeit. Unverbindlich.',
    },
  },
  catalog: {
    stage: 'education',
    title: {
      pl: 'Nie widzisz profilu, którego szukasz?',
      en: 'Not finding the profile you need?',
      de: 'Nicht das richtige Profil gefunden?',
    },
    text: {
      pl: 'Opisz zastosowanie — często da się dobrać profil, którego nie ma w katalogu, bo robimy je na wymiar.',
      en: 'Describe the application — we can often supply a profile that is not in the range, because we cut to size.',
      de: 'Beschreiben Sie die Anwendung — oft lässt sich ein Profil liefern, das nicht im Katalog steht, weil wir auf Maß fertigen.',
    },
    primary: quoteAction,
    secondary: callAction,
    microcopy: {
      pl: 'Podaj profil, długość i ilość — przygotujemy indywidualną wycenę.',
      en: 'Give the profile, length and quantity — we will prepare an individual quote.',
      de: 'Nennen Sie Profil, Länge und Menge — wir erstellen ein individuelles Angebot.',
    },
  },
  product: {
    stage: 'education',
    title: {
      pl: 'Masz wymiary? Napisz',
      en: 'Got the dimensions? Write to us',
      de: 'Maße parat? Schreiben Sie uns',
    },
    text: {
      pl: 'Długość, przekrój, ilość — wystarczy.',
      en: 'Length, section, quantity — that is all we need.',
      de: 'Länge, Querschnitt, Menge — mehr brauchen wir nicht.',
    },
    primary: quoteAction,
    secondary: callAction,
    microcopy: {
      pl: 'Przygotujemy indywidualną wycenę z terminem realizacji. Bez zobowiązań.',
      en: 'We will prepare an individual quote with the lead time. No commitment.',
      de: 'Wir erstellen ein individuelles Angebot mit Lieferzeit. Unverbindlich.',
    },
  },
  about: {
    stage: 'education',
    title: {
      pl: 'Zobaczmy, co z tego wyjdzie',
      en: 'Let us see what comes out of it',
      de: 'Lassen Sie uns sehen, was daraus wird',
    },
    text: {
      pl: 'Przyślij wymiary i zastosowanie — wycenimy materiał i podamy termin realizacji.',
      en: 'Send the dimensions and the application — we will quote the material and give you a lead time.',
      de: 'Senden Sie Maße und Anwendung — wir kalkulieren das Material und nennen den Liefertermin.',
    },
    primary: quoteAction,
    secondary: callAction,
    microcopy: {
      pl: 'Przygotujemy indywidualną wycenę z terminem realizacji. Bez zobowiązań.',
      en: 'We will prepare an individual quote with the lead time. No commitment.',
      de: 'Wir erstellen ein individuelles Angebot mit Lieferzeit. Unverbindlich.',
    },
  },
  gallery: {
    stage: 'education',
    title: {
      pl: 'Chcesz takie drewno u siebie?',
      en: 'Want this wood in your project?',
      de: 'Dieses Holz in Ihrem Projekt?',
    },
    text: {
      pl: 'Opisz wymiary i zastosowanie — przygotujemy indywidualną wycenę.',
      en: 'Describe the dimensions and the application — we will prepare an individual quote.',
      de: 'Beschreiben Sie Maße und Anwendung — wir erstellen ein individuelles Angebot.',
    },
    primary: quoteAction,
    secondary: callAction,
    microcopy: {
      pl: 'Przygotujemy indywidualną wycenę z terminem realizacji. Bez zobowiązań.',
      en: 'We will prepare an individual quote with the lead time. No commitment.',
      de: 'Wir erstellen ein individuelles Angebot mit Lieferzeit. Unverbindlich.',
    },
  },
  delivery: {
    stage: 'consideration',
    title: {
      pl: 'Sprawdź termin dla swojego zamówienia',
      en: 'Check the lead time for your order',
      de: 'Prüfen Sie die Lieferzeit für Ihre Bestellung',
    },
    text: {
      pl: 'Podaj profil, długość i ilość — termin realizacji podajemy w wycenie.',
      en: 'Give the profile, the length and the quantity — we state the lead time in the quote.',
      de: 'Nennen Sie Profil, Länge und Menge — die Lieferzeit nennen wir im Angebot.',
    },
    primary: priceListAction,
    secondary: callAction,
    microcopy: {
      pl: 'Termin realizacji i warunki dostawy potwierdzamy w wycenie.',
      en: 'We confirm the lead time and the delivery terms in the quote.',
      de: 'Lieferzeit und Lieferbedingungen bestätigen wir im Angebot.',
    },
  },
  priceList: {
    stage: 'consideration',
    title: {
      pl: 'Poproś o cennik',
      en: 'Ask for the price list',
      de: 'Preisliste anfordern',
    },
    text: {
      pl: 'Cena zależy od profilu, długości, grubości i ilości — wyceniamy pisemnie.',
      en: 'The price depends on profile, length, thickness and quantity — we quote in writing.',
      de: 'Der Preis hängt von Profil, Länge, Stärke und Menge ab — wir kalkulieren schriftlich.',
    },
    primary: priceListAction,
    secondary: callAction,
    microcopy: {
      pl: 'W wycenie: cena za jednostkę, termin realizacji i warunki dostawy. Bez zobowiązań.',
      en: 'In the quote: price per unit, lead time and delivery terms. No commitment.',
      de: 'Im Angebot: Preis je Einheit, Lieferzeit und Lieferbedingungen. Unverbindlich.',
    },
  },
  trade: {
    stage: 'consideration',
    title: {
      pl: 'Wycena na całą partię',
      en: 'A quote for the whole batch',
      de: 'Angebot für die ganze Charge',
    },
    text: {
      pl: 'Podaj profil, długość i ilość — wyceniamy jednostkę i całość osobno.',
      en: 'Give the profile, the length and the quantity — we quote the unit and the batch separately.',
      de: 'Nennen Sie Profil, Länge und Menge — wir kalkulieren Einheit und Charge getrennt.',
    },
    primary: priceListAction,
    secondary: callAction,
    microcopy: {
      pl: 'W wycenie: cena jednostki i całej partii, termin i warunki dostawy.',
      en: 'In the quote: price for the unit and for the batch, lead time and delivery terms.',
      de: 'Im Angebot: Preis für Einheit und Charge, Lieferzeit und Lieferbedingungen.',
    },
  },
  contact: {
    stage: 'conversion',
    title: {
      pl: 'Wyślij zapytanie',
      en: 'Send the enquiry',
      de: 'Anfrage senden',
    },
    text: {
      pl: 'Jedna akcja: zostaw zapytanie. Resztę doprecyzujemy w odpowiedzi.',
      en: 'One action: leave the enquiry. We clarify the rest in the reply.',
      de: 'Eine Aktion: Anfrage hinterlassen. Den Rest klären wir in der Antwort.',
    },
    primary: {
      label: { pl: 'Wyślij zapytanie', en: 'Send the enquiry', de: 'Anfrage senden' },
      target: { type: 'route', route: 'quote' },
    },
    secondary: whatsappAction,
    microcopy: {
      pl: 'Odpowiadamy e-mailem. Możesz też napisać na WhatsApp albo zadzwonić.',
      en: 'We reply by email. You can also message us on WhatsApp or call.',
      de: 'Wir antworten per E-Mail. Sie können auch per WhatsApp schreiben oder anrufen.',
    },
  },
};

/* ------------------------------------------------------------------ *
 * Blok 3 kroków — wybierz → cennik i termin → partia ucięta.
 * ------------------------------------------------------------------ */

export interface FunnelStep {
  title: FunnelText;
  text: FunnelText;
}

export const funnelSteps: FunnelStep[] = [
  {
    title: {
      pl: 'Wybierasz profil i wymiary',
      en: 'You choose the profile and the dimensions',
      de: 'Sie wählen Profil und Maße',
    },
    text: {
      pl: 'Podaj profil, długość, przekrój i ilość. Resztę dobieramy razem z Tobą.',
      en: 'Give the profile, length, section and quantity. We agree the rest together.',
      de: 'Nennen Sie Profil, Länge, Querschnitt und Menge. Den Rest klären wir gemeinsam.',
    },
  },
  {
    title: {
      pl: 'Dostajesz wycenę i termin',
      en: 'You get the quote and the lead time',
      de: 'Sie erhalten Angebot und Lieferzeit',
    },
    text: {
      pl: 'Odpowiadamy pisemnie: cena za jednostkę, termin realizacji i warunki dostawy.',
      en: 'We reply in writing: price per unit, lead time and delivery terms.',
      de: 'Wir antworten schriftlich: Preis je Einheit, Lieferzeit und Lieferbedingungen.',
    },
  },
  {
    title: {
      pl: 'Otrzymujesz partię uciętą na wymiar',
      en: 'You get the batch cut to size',
      de: 'Sie erhalten die auf Maß geschnittene Charge',
    },
    text: {
      pl: 'Listony gotowe do montażu, kurierem w całej Polsce.',
      en: 'Battens ready to install, by courier within Poland.',
      de: 'Leisten montagebereit, per Kurier in ganz Polen.',
    },
  },
];

/* ------------------------------------------------------------------ *
 * Elementy zaufania — tylko to, co da się sprawdzić.
 * ------------------------------------------------------------------ */

export interface TrustItem {
  /** Nazwa ikony w `src/components/Icon.astro`. */
  icon: string;
  text: FunnelText;
}

export const trustItems: TrustItem[] = [
  {
    icon: 'camera',
    text: {
      pl: 'Zdjęcia z prawdziwych realizacji',
      en: 'Photos from real projects',
      de: 'Fotos aus echten Projekten',
    },
  },
  {
    icon: 'workshop',
    text: {
      pl: 'Własna produkcja w Słonecznik',
      en: 'Own production in Słonecznik',
      de: 'Eigene Fertigung in Słonecznik',
    },
  },
  {
    icon: 'truck',
    text: {
      pl: 'Kurierem w całej Polsce',
      en: 'Courier within Poland',
      de: 'Per Kurier in ganz Polen',
    },
  },
  {
    icon: 'handshake',
    text: {
      // SEDO to inny producent — nasze są obłogi, z których powstają ich panele.
      pl: 'Panele SEDO — z naszych obłogów, ich marka',
      en: 'SEDO panels — made from our battens, their brand',
      de: 'SEDO-Paneele — aus unseren Leisten, ihre Marke',
    },
  },
];

/* ------------------------------------------------------------------ *
 * Obiekcje — pytania, które pojawiają się przed zamówieniem.
 * To NIE jest FAQ: FAQ odpowiada na pytania o produkt, to odpowiada
 * na pytania o zakup. Te odpowiedzi są widoczne bez rozwijania.
 * ------------------------------------------------------------------ */

export interface Objection {
  question: FunnelText;
  answer: FunnelText;
}

export const objections: Objection[] = [
  {
    question: {
      pl: 'Jaki jest minimalny wolumen?',
      en: 'What is the minimum order?',
      de: 'Wie groß ist die Mindestbestellmenge?',
    },
    answer: {
      pl: 'Ustalany w wycenie — zależy od profilu i długości.',
      en: 'Set in the quote — it depends on the profile and the length.',
      de: 'Wird im Angebot festgelegt — hängt von Profil und Länge ab.',
    },
  },
  {
    question: {
      pl: 'Ile trwa realizacja?',
      en: 'How long does production take?',
      de: 'Wie lange dauert die Fertigung?',
    },
    answer: {
      pl: 'Termin podajemy w wycenie, po potwierdzeniu wymiarów.',
      en: 'We state the lead time in the quote, once the dimensions are confirmed.',
      de: 'Die Lieferzeit nennen wir im Angebot, nach Bestätigung der Maße.',
    },
  },
  {
    question: {
      pl: 'A co jeśli drewno wygląda inaczej niż na zdjęciu?',
      en: 'What if the wood does not look like the photo?',
      de: 'Und wenn das Holz anders aussieht als auf dem Foto?',
    },
    answer: {
      pl: 'Naturalne drewno nie ma dwóch identycznych desek. Selekcję (bez sęków / z sękami) i wykończenie ustalamy przed cięciem.',
      en: 'Natural wood never gives two identical boards. We agree the selection (knot-free / with knots) and the finish before cutting.',
      de: 'Natürliches Holz hat nie zwei identische Bretter. Selektion (ohne Äste / mit Ästen) und Oberfläche legen wir vor dem Zuschnitt fest.',
    },
  },
  {
    question: {
      pl: 'Czy wystawiacie fakturę?',
      en: 'Do you issue an invoice?',
      de: 'Stellen Sie eine Rechnung aus?',
    },
    answer: {
      pl: 'Faktura albo przelew — formę rozliczenia i termin płatności potwierdzamy w wycenie.',
      en: 'Invoice or bank transfer — we confirm the settlement method and the payment term in the quote.',
      de: 'Rechnung oder Überweisung — Abrechnungsart und Zahlungsziel bestätigen wir im Angebot.',
    },
  },
  {
    question: {
      pl: 'Czy wysyłacie poza Polskę?',
      en: 'Do you ship outside Poland?',
      de: 'Versenden Sie außerhalb Polens?',
    },
    answer: {
      pl: 'Kurierem w całej Polsce. Poza Polską — wycena indywidualnie.',
      en: 'By courier within Poland. Outside Poland — quoted individually.',
      de: 'Per Kurier in ganz Polen. Außerhalb Polens — Angebot auf Anfrage.',
    },
  },
  {
    question: {
      pl: 'Czy mogę dostać próbkę profilu?',
      en: 'Can I get a sample of the profile?',
      de: 'Kann ich ein Musterprofil bekommen?',
    },
    answer: {
      pl: 'Dostępność i koszt wysyłki próbki potwierdzamy w wycenie.',
      en: 'Availability and shipping cost of a sample are confirmed in the quote.',
      de: 'Verfügbarkeit und Versandkosten eines Musters bestätigen wir im Angebot.',
    },
  },
];

/**
 * Las cuatro preguntas del COMPRADOR PROFESIONAL (la lista entera se queda en
 * /cennik/). Aquí no caben seis: en la maqueta la columna de preguntas va a
 * la altura de la tabla de datos, y la de la madera se parece a la del
 * consumidor final — la del stolarza es el volumen, el plazo y la factura.
 */
export const tradeObjections: Objection[] = [
  objections[0],
  objections[1],
  objections[3],
  objections[4],
];

/* ------------------------------------------------------------------ *
 * Mikrocopy formularza.
 * ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ *
 * DWA EMBUDOS — formularz zależy od tego, o co pyta klient.
 *
 * EMBUDO A — panele sufitowe i ścienne (gotowe, z profilem i krawędzią).
 *   Mierzy się w m². Pytamy o powierzchnię, nie o długość i przekrój.
 * EMBUDO B — obłogi i lamele (materiał do cięcia).
 *   Mierzy się w metrach bieżących. Pytamy o długość, przekrój i ilość.
 *
 * DLACZEGO DWA, A NIE JEDEN: jeden formularz z polem „opisz, o co pytasz"
 * daje zapytania, których nie da się wycenić bez odpytania. „Proszę o wycenę
 * 20 mb" i „proszę o wycenę 40 m² sufitu" to dwie różne rozmowy, a klient
 * musi wiedzieć, którą z nich zaczyna.
 *
 * REGULA: te pola, które są wymagane, są wymagane TYLKO w swoim embudzie.
 * Nie pytamy o rzeczy, które w danym embudzie nie mają sensu (m² przy
 * obłogach, długość przy panelach).
 *
 * Wszystkie wartości w opcjach pochodzą z potwierdzonej oferty
 * (`src/content/definitions.ts` → `definitionFacts`, source: 'oferta').
 * NIE MA TU wartości zmyślonych.
 * ------------------------------------------------------------------ */

/** Który embudo reprezentuje pole. */
export type FunnelVariant = 'A' | 'B';

/** Rodzaj kontrolki pola. */
export type FunnelFieldType = 'text' | 'number' | 'textarea' | 'select' | 'products';

export interface FunnelField {
  /** Nazwa pola w formularzu — kontrakt z endpointem. */
  name: string;
  /** Etykieta widoczna. */
  label: FunnelText;
  /** Podpowiedź pod polem (nie etykieta). */
  hint?: FunnelText;
  /** Typ kontrolki. */
  type: FunnelFieldType;
  /** Czy pole jest wymagane W TYM EMBUDO. */
  required?: boolean;
  /**
   * `main` = pole na pierwszym planie (wymagane albo kluczowe).
   * `extra` = pole w zwijanym `<details>` — nie blokuje wyceny, ale przyspiesza odpowiedź.
   */
  group?: 'main' | 'extra';
  /** Opcje dla `select` — tylko wartości potwierdzone. */
  options?: { value: string; label: FunnelText }[];
  /** Placeholder dla `text` / `textarea` / `number`. */
  placeholder?: FunnelText;
  /** `inputmode` dla pól liczbowych. */
  inputMode?: 'text' | 'numeric' | 'decimal';
  /** Minimalna wartość dla `number` (np. 1 dla ilości). */
  min?: number;
  /** Krok dla `number`. */
  step?: number;
}

/**
 * EMBUDO A — panele sufitowe i ścienne.
 *
 * Powierzchnia jest przybliżona i to wystarczy: wycena idzie po wymiarze
 * i ilości modułów, a nie po centymetrze. Dlatego m² ma „około" w etykiecie
 * i nie jest polem precyzyjnym.
 */
export const funnelFieldsA: FunnelField[] = [
  {
    name: 'surface',
    label: {
      pl: 'Przybliżona powierzchnia (m²)',
      en: 'Approximate area (m²)',
      de: 'Ungefähre Fläche (m²)',
    },
    hint: {
      pl: 'Wystarczy przybliżenie — dokładny wymiar policzymy z modułów.',
      en: 'An approximation is enough — the exact size we calculate from the modules.',
      de: 'Eine Näherung genügt — die genaue Größe rechnen wir aus den Modulen.',
    },
    type: 'number',
    required: true,
    group: 'main',
    inputMode: 'decimal',
    min: 1,
    step: 0.1,
    placeholder: {
      pl: 'np. 24',
      en: 'e.g. 24',
      de: 'z. B. 24',
    },
  },
  {
    name: 'modules',
    label: {
      pl: 'Liczba modułów (szt.)',
      en: 'Number of modules (pcs)',
      de: 'Anzahl Module (Stück)',
    },
    hint: {
      pl: 'Jeśli wiesz, ile modułów wchodzi w pomieszczenie.',
      en: 'If you know how many modules fit the room.',
      de: 'Wenn Sie wissen, wie viele Module in den Raum passen.',
    },
    type: 'number',
    group: 'extra',
    inputMode: 'numeric',
    min: 1,
    step: 1,
    placeholder: {
      pl: 'np. 8',
      en: 'e.g. 8',
      de: 'z. B. 8',
    },
  },
  {
    name: 'room',
    label: {
      pl: 'Pomieszczenie lub zastosowanie',
      en: 'Room or intended use',
      de: 'Raum oder Verwendungszweck',
    },
    hint: {
      pl: 'Np. sufit salonu, ściana w sypialni, wnęka w kuchni.',
      en: 'E.g. living room ceiling, bedroom wall, kitchen recess.',
      de: 'Z. B. Wohnzimmerdecke, Schlafzimmerwand, Küchennische.',
    },
    type: 'text',
    group: 'extra',
    placeholder: {
      pl: 'np. sufit salonu, 4 × 5 m',
      en: 'e.g. living room ceiling, 4 × 5 m',
      de: 'z. B. Wohnzimmerdecke, 4 × 5 m',
    },
  },
];

/**
 * EMBUDO B — obłogi i lamele (materiał).
 *
 * Długość i przekrój są ODDZIELNYMI polami, bo to dwie niezależne dane do
 * wyceny. Ilość jest wymagana: bez niej nie ma ceny.
 */
export const funnelFieldsB: FunnelField[] = [
  {
    name: 'length',
    label: {
      pl: 'Długość (mm)',
      en: 'Length (mm)',
      de: 'Länge (mm)',
    },
    type: 'number',
    required: true,
    group: 'main',
    inputMode: 'numeric',
    min: 1,
    step: 1,
    placeholder: {
      pl: 'np. 2500',
      en: 'e.g. 2500',
      de: 'z. B. 2500',
    },
  },
  {
    name: 'section',
    label: {
      pl: 'Przekrój (mm)',
      en: 'Section (mm)',
      de: 'Querschnitt (mm)',
    },
    hint: {
      pl: 'Szerokość × grubość, np. 40 × 20 mm.',
      en: 'Width × thickness, e.g. 40 × 20 mm.',
      de: 'Breite × Dicke, z. B. 40 × 20 mm.',
    },
    type: 'text',
    required: true,
    group: 'main',
    placeholder: {
      pl: 'np. 40 × 20 mm',
      en: 'e.g. 40 × 20 mm',
      de: 'z. B. 40 × 20 mm',
    },
  },
  {
    name: 'quantity',
    label: {
      pl: 'Ilość (mb)',
      en: 'Quantity (linear metres)',
      de: 'Menge (lfm)',
    },
    hint: {
      pl: 'Metry bieżące. Przy lamelach podaj liczbę elementów.',
      en: 'Linear metres. For battens, give the number of pieces.',
      de: 'Laufende Meter. Bei Lamellen die Stückzahl angeben.',
    },
    type: 'number',
    required: true,
    group: 'main',
    inputMode: 'decimal',
    min: 1,
    step: 0.1,
    placeholder: {
      pl: 'np. 20',
      en: 'e.g. 20',
      de: 'z. B. 20',
    },
  },
  {
    name: 'profile',
    label: {
      pl: 'Profil',
      en: 'Profile',
      de: 'Profil',
    },
    type: 'select',
    group: 'extra',
    options: [
      {
        value: '',
        label: {
          pl: '— wybierz albo opisz —',
          en: '— choose or describe —',
          de: '— wählen oder beschreiben —',
        },
      },
      {
        value: 'plain',
        label: { pl: 'Prosty', en: 'Plain', de: 'Einfach' },
      },
      {
        value: 'tongue-groove',
        label: { pl: 'Piętro-wpust', en: 'Tongue and groove', de: 'Nut und Feder' },
      },
      {
        value: 'to-agree',
        label: { pl: 'Do uzgodnienia', en: 'To be agreed', de: 'Nach Absprache' },
      },
    ],
  },
  {
    name: 'selection',
    label: {
      pl: 'Selekcja drewna',
      en: 'Wood selection',
      de: 'Holzselektion',
    },
    type: 'select',
    group: 'extra',
    options: [
      {
        value: '',
        label: { pl: '— wybierz —', en: '— choose —', de: '— wählen —' },
      },
      {
        value: 'knot-free',
        label: { pl: 'Bez sęków', en: 'Knot-free', de: 'Ohne Äste' },
      },
      {
        value: 'with-knots',
        label: { pl: 'Z sękami', en: 'With knots', de: 'Mit Ästen' },
      },
    ],
  },
  {
    name: 'finish',
    label: {
      pl: 'Wykończenie',
      en: 'Finish',
      de: 'Oberfläche',
    },
    type: 'select',
    group: 'extra',
    options: [
      {
        value: '',
        label: { pl: '— wybierz —', en: '— choose —', de: '— wählen —' },
      },
      {
        value: 'natural',
        label: { pl: 'Naturalne', en: 'Natural', de: 'Natur' },
      },
      {
        value: 'brushed',
        label: { pl: 'Szczotkowane', en: 'Brushed', de: 'Gebürstet' },
      },
      {
        value: 'smoked',
        label: { pl: 'Wędzone', en: 'Smoked', de: 'Geräuchert' },
      },
    ],
  },
];

/**
 * Pytanie, które rozdziela oba embudy na stronie cennika.
 *
 * Jedno pytanie, dwa wyjścia — a nie dwie ścieżki do wyboru. Klient ma
 * jedno zdanie do powiedzenia, a resztę pytań dostajemy w formularzu.
 */
export const funnelChoice = {
  kicker: {
    pl: 'Co wyceniamy?',
    en: 'What are we quoting?',
    de: 'Was kalkulieren wir?',
  },
  question: {
    pl: 'Czego potrzebujesz wyceny?',
    en: 'What do you need a quote for?',
    de: 'Für was brauchen Sie ein Angebot?',
  },
  /**
   * Las dos opciones del selector. La primera es la de los listones
   * (obłogi y lamelas): es el producto que da nombre a la casa y lo primero
   * que pregunta quien escribe.
   */
  options: [
    {
      value: 'B' as const,
      icon: 'stack',
      label: {
        pl: 'Obłóg / lamela',
        en: 'Oak trim & battens',
        de: 'Abschlussleiste / Lamelle',
      },
      hint: {
        pl: 'Listwy, lamele, obłogi cięte na wymiar. Mierzymy w metrach.',
        en: 'Trim and battens, cut to size. We measure in linear metres.',
        de: 'Leisten, Lamellen, Abschlussleisten auf Maß geschnitten. Wir messen in Metern.',
      },
    },
    {
      value: 'A' as const,
      icon: 'panel',
      label: {
        pl: 'Gotowe panele',
        en: 'Ready-made panels',
        de: 'Fertige Paneele',
      },
      hint: {
        pl: 'Panele sufitowe i ścienne z naturalnego dębu. Mierzymy w m².',
        en: 'Ceiling and wall panels from natural oak. We measure in m².',
        de: 'Decken- und Wandpaneele aus natürlicher Eiche. Wir messen in m².',
      },
    },
  ],
} as const;

/**
 * Copy dla zwiniętego bloku pól dodatkowych w każdym embudzie.
 *
 * Osobne, bo to, co przyspiesza odpowiedź, zależy od tego, o co pytają:
 * przy panelach liczy się liczba modułów i pomieszczenie, przy listwach —
 * profil, selekcja i wykończenie. Wspólny nagłówek („dodaj firmę, NIP…")
 * byłby tu kłamstwem.
 */
export const funnelExtras: Record<
  FunnelVariant,
  { toggle: FunnelText; intro: FunnelText }
> = {
  A: {
    toggle: {
      pl: 'Dodaj liczbę modułów i pomieszczenie',
      en: 'Add the module count and the room',
      de: 'Modulanzahl und Raum ergänzen',
    },
    intro: {
      pl: 'Jedna linia w wiadomości — nie jest wymagane.',
      en: 'One line in the message — it is not required.',
      de: 'Eine Zeile in der Nachricht — nicht erforderlich.',
    },
  },
  B: {
    toggle: {
      pl: 'Dodaj profil, selekcję i wykończenie',
      en: 'Add the profile, selection and finish',
      de: 'Profil, Selektion und Oberfläche ergänzen',
    },
    intro: {
      pl: 'Jedna linia w wiadomości — nie jest wymagane.',
      en: 'One line in the message — it is not required.',
      de: 'Eine Zeile in der Nachricht — nicht erforderlich.',
    },
  },
};

/** Pola danego embudu. */
export function fieldsFor(variant: FunnelVariant): FunnelField[] {
  return variant === 'A' ? funnelFieldsA : funnelFieldsB;
}

/**
 * Qué embudo corresponde a cada producto.
 *
 * Lo usa el enlace con `?produkt=<id>`: quien pulsa «Zapytaj o panele
 * sufitowe» ya ha dicho de qué producto va la consulta, así que el
 * formulario no vuelve a preguntarle entre paneles y listones.
 */
export const funnelByProduct: Record<string, FunnelVariant> = {
  'panele-dabowe': 'A',
  'oblog-debowy-ciety': 'B',
  'oblog-debowy-wedzony': 'B',
  'lamela-debowa': 'B',
};

export const formCopy = {
  /** Co dostaje osoba, która wysyła zapytanie. */
  promise: {
    pl: 'Przygotujemy indywidualną wycenę z terminem realizacji.',
    en: 'We will prepare an individual quote with the lead time.',
    de: 'Wir erstellen ein individuelles Angebot mit Lieferzeit.',
  },
  /** Co się dzieje po naciśnięciu przycisku. */
  whatHappens: {
    pl: 'Zapytanie trafia do nas — odpowiadamy e-mailem na podany adres.',
    en: 'The enquiry comes to us — we reply by email to the address you give.',
    de: 'Die Anfrage kommt zu uns — wir antworten per E-Mail an die angegebene Adresse.',
  },
  /**
   * Co się dzieje, gdy NIE ma endpointu: otwiera się klient poczty z gotową
   * treścią. Bez tej wersji tekst kłamałby — obiecywałby dostarczenie
   * zapytania, którego wtedy nie ma gdzie dostarczyć.
   */
  whatHappensMailto: {
    pl: 'Zapytanie otworzy Twój program pocztowy — wyślij je, a zajmiemy się resztą.',
    en: 'The enquiry opens your mail app — send it there and we will take care of the rest.',
    de: 'Die Anfrage öffnet Ihr E-Mail-Programm — senden Sie sie, wir übernehmen den Rest.',
  },
  /** Brak zobowiązań. */
  noCommitment: {
    pl: 'Bez zobowiązań — zapytanie nie jest zamówieniem.',
    en: 'No commitment — an enquiry is not an order.',
    de: 'Unverbindlich — eine Anfrage ist keine Bestellung.',
  },
  /** Etykieta wyjścia przez WhatsApp. */
  whatsappLabel: {
    pl: 'Wyślij na WhatsApp',
    en: 'Send via WhatsApp',
    de: 'Per WhatsApp senden',
  },
  /** Podpowiedź przy wyjściu przez WhatsApp. */
  whatsappHint: {
    pl: 'Otworzy WhatsAppa z gotowym tekstem zapytania — odpiszemy tam.',
    en: 'Opens WhatsApp with the enquiry text ready — we answer there.',
    de: 'Öffnet WhatsApp mit fertigem Anfragetext — wir antworten dort.',
  },
  /** Krok 2 — dane opcjonalne. */
  step2Label: {
    pl: 'Dane dodatkowe (opcjonalnie)',
    en: 'Extra details (optional)',
    de: 'Zusatzangaben (optional)',
  },
  /** Przycisk rozwijający krok 2. */
  step2Toggle: {
    pl: 'Dodaj firmę, NIP lub telefon',
    en: 'Add company, tax ID or phone',
    de: 'Firma, Steuernummer oder Telefon ergänzen',
  },
  /** Wyjście awaryjne bez JavaScriptu. */
  mailtoLabel: {
    pl: 'Wyślij e-mailem',
    en: 'Send by email',
    de: 'Per E-Mail senden',
  },
  /** Podpowiedź pod wyjściem awaryjnym. */
  mailtoHint: {
    pl: 'Otworzy program pocztowy z gotową treścią. Uzupełnij w nim wymiary i ilość.',
    en: 'Opens your mail app with a ready message. Fill in the dimensions and the quantity there.',
    de: 'Öffnet Ihr E-Mail-Programm mit fertiger Nachricht. Maße und Menge dort ergänzen.',
  },
  /** Szablon treści wiadomości awaryjnej (pola do uzupełnienia). */
  mailtoTemplate: {
    pl: [
      'Zapytanie o wycenę — Doors Obłogi',
      '',
      'Produkt:',
      'Wymiary (długość × przekrój):',
      'Ilość:',
      'Zastosowanie:',
      '',
      'Imię i nazwisko:',
      'Telefon:',
      'E-mail:',
    ],
    en: [
      'Quote request — Doors Obłogi',
      '',
      'Product:',
      'Dimensions (length × section):',
      'Quantity:',
      'Application:',
      '',
      'Full name:',
      'Phone:',
      'Email:',
    ],
    de: [
      'Angebotsanfrage — Doors Obłogi',
      '',
      'Produkt:',
      'Maße (Länge × Querschnitt):',
      'Menge:',
      'Verwendung:',
      '',
      'Name:',
      'Telefon:',
      'E-Mail:',
    ],
  },
  /** Etykieta sekcji dodatkowej w formularzu. */
  step2Intro: {
    pl: 'Uzupełnij, jeśli przyspieszy odpowiedź — przy zamówieniach hurtowych potrzebujemy też NIP.',
    en: 'Fill in if it speeds up the reply — for trade orders we also need the tax ID.',
    de: 'Ausfüllen, wenn es die Antwort beschleunigt — für Großhandelsbestellungen brauchen wir auch die Steuernummer.',
  },
  /** Etykieta pola „wymiary" — zawiera ilość, bo ilość jest częścią wyceny. */
  messageLabel: {
    pl: 'Wymiary, ilość i zastosowanie',
    en: 'Dimensions, quantity and intended use',
    de: 'Maße, Menge und Verwendungszweck',
  },
  /** Podpowiedź w polu „wymiary". */
  messagePlaceholder: {
    pl: 'np. 3 m długości, przekrój 40 × 20 mm, 20 szt., listwy wykończeniowe do domku letniskiego',
    en: 'e.g. 3 m length, 40 × 20 mm section, 20 pcs, trim battens for a holiday cottage',
    de: 'z. B. 3 m Länge, Querschnitt 40 × 20 mm, 20 Stück, Abschlussleisten für ein Ferienhaus',
  },
  /** Etykieta grupy pól kontaktowych w pierwszym kroku. */
  contactLabel: {
    pl: 'Jak się skontaktować',
    en: 'How to reach you',
    de: 'So erreichen wir Sie',
  },
  /**
   * Linia, która idzie w treść wiadomości i mówi, że zapytanie jest
   * wyraźnie oznaczone. Bez niej w skrzynce wygląda jak zwykły list.
   */
  leadLine: {
    pl: 'Zapytanie o wycenę — Doors Obłogi',
    en: 'Quote request — Doors Obłogi',
    de: 'Angebotsanfrage — Doors Obłogi',
  },
  /** Etykieta zgody w treści wiadomości — dowód zgody (RODO art. 7.1). */
  consentLabel: {
    pl: 'Zgoda na kontakt w sprawie tej wyceny',
    en: 'Consent to be contacted about this quote',
    de: 'Einwilligung zur Kontaktaufnahme zu diesem Angebot',
  },
  /** Wartość zgody w treści wiadomości. */
  consentYes: {
    pl: 'tak',
    en: 'yes',
    de: 'ja',
  },
  /** Etykieta miejsca dostawy. */
  placeLabel: {
    pl: 'Miejsce dostawy (miejscowość)',
    en: 'Delivery place (town)',
    de: 'Lieferort (Ort)',
  },
  /** Etykieta wybranego embudu w treści wiadomości. */
  funnelLabel: {
    pl: 'Zakres zapytania',
    en: 'Enquiry scope',
    de: 'Anfrageumfang',
  },
  /** Etykieta strony, z której przyszło zapytanie. */
  pageLabel: {
    pl: 'Strona',
    en: 'Page',
    de: 'Seite',
  },
  /** Etykieta języka strony. */
  localeLabel: {
    pl: 'Język',
    en: 'Language',
    de: 'Sprache',
  },
  /**
   * UWAGA: nazw wartości wybranych w formularzu NIE MA w tym pliku.
   * Żyją w `funnelFieldsB[].options` — jedno źródło prawdy. Ten plik nie
   * duplikuje ich, bo druga kopia zawsze rozjedzie się z pierwszą.
   */
} as const;

/* ------------------------------------------------------------------ *
 * Barra flotante de móvil — tres acciones: llamar / WhatsApp / cotizar.
 * ------------------------------------------------------------------ */

export interface StickyAction {
  label: FunnelText;
  action: FunnelAction;
  icon: string;
  /** `true` = acción principal (la que se queda resaltada). */
  primary?: boolean;
  /** Etiqueta accesible — más explícita que el texto visible. */
  ariaLabel: FunnelText;
}

export const stickyActions: StickyAction[] = [
  {
    label: { pl: 'Zadzwoń', en: 'Call', de: 'Anrufen' },
    action: callAction,
    icon: 'phone',
    ariaLabel: {
      pl: `Zadzwoń: ${company.phoneE164}`,
      en: `Call us: ${company.phoneE164}`,
      de: `Anrufen: ${company.phoneE164}`,
    },
  },
  {
    label: { pl: 'WhatsApp', en: 'WhatsApp', de: 'WhatsApp' },
    action: whatsappAction,
    icon: 'chat',
    ariaLabel: {
      pl: 'Napisz na WhatsApp — otworzy gotową wiadomość',
      en: 'Message on WhatsApp — opens a ready message',
      de: 'Per WhatsApp schreiben — öffnet eine fertige Nachricht',
    },
  },
  {
    label: { pl: 'Wycenę', en: 'Quote', de: 'Angebot' },
    action: quoteAction,
    icon: 'ruler',
    primary: true,
    ariaLabel: {
      pl: 'Zapytaj o wycenę — formularz',
      en: 'Request a quote — the form',
      de: 'Angebot anfordern — das Formular',
    },
  },
];

/** Etiqueta accesible de la barra flotante. */
export const stickyLabel: FunnelText = {
  pl: 'Szybki kontakt',
  en: 'Quick contact',
  de: 'Schnellkontakt',
};

/* ------------------------------------------------------------------ *
 * Nagłówki bloków — komponenty nie mają własnych literałów.
 * ------------------------------------------------------------------ */

export const howItWorks = {
  kicker: { pl: 'Proces', en: 'Process', de: 'Ablauf' },
  title: { pl: 'Jak to działa', en: 'How it works', de: 'So funktioniert es' },
  lede: {
    pl: 'Trzy kroki od zapytania do partii uciętej na wymiar.',
    en: 'Three steps from the enquiry to the batch cut to size.',
    de: 'Drei Schritte von der Anfrage bis zur auf Maß geschnittenen Charge.',
  },
} as const;

export const objectionBlock = {
  kicker: { pl: 'Zanim zapytasz', en: 'Before you ask', de: 'Bevor Sie fragen' },
  title: {
    pl: 'Pytania, które padają przed zamówieniem',
    en: 'Questions that come up before an order',
    de: 'Fragen, die vor der Bestellung kommen',
  },
  lede: {
    pl: 'Odpowiadamy krótko i wprost — bez zastrzeżeń.',
    en: 'We answer briefly and to the point — no fine print.',
    de: 'Wir antworten kurz und direkt — ohne Kleingedrucktes.',
  },
} as const;

export const trustBlock = {
  kicker: { pl: 'Dlaczego warto', en: 'Why us', de: 'Warum wir' },
  title: {
    pl: 'Co można sprawdzić samemu',
    en: 'What you can check yourself',
    de: 'Was Sie selbst prüfen können',
  },
} as const;

/* ------------------------------------------------------------------ *
 * PENDIENTES — qué dato falta del cliente para poder quitar cada TODO.
 * Se rellena cuando el cliente confirme; nada aquí es una suposición.
 * ------------------------------------------------------------------ */
export const pendingClientData = [
  {
    key: 'minimumOrder',
    question: 'Jakie jest minimalne zamówienie (mb / szt.)?',
    impact: 'terms.ts → wiersz „Minimalne zamówienie” (teraz: „ustalane w wycenie”).',
  },
  {
    key: 'leadTime',
    question: 'Ile dni roboczych trwa realizacja i jaki jest termin dostawy?',
    impact:
      'terms.ts → „Termin realizacji” (teraz `confirmed: false`), definitionFacts, ' +
      'pages.ts → FAQ „Gdzie dostarczacie i jak długo trwa realizacja?”, llms.txt.',
  },
  {
    key: 'paymentTerms',
    question: 'Przelew czy faktura, jaki termin płatności, czy cena brutto czy netto?',
    impact: 'terms.ts → „Forma płatności”; objectiones → „Czy wystawiacie fakturę?”.',
  },
  {
    key: 'sample',
    question: 'Czy próbka profilu jest możliwa i ile kosztuje (w tym wysyłka)?',
    impact: 'terms.ts → „Próbka profilu”; objectiones → „Czy mogę dostać próbkę?”.',
  },
  {
    key: 'tolerances',
    question: 'Jakie tolerancje wymiarowe obowiązują przy cięciu?',
    impact: 'technical.ts → „Tolerancja długości”; terms.ts → „Tolerancje wymiarowe”.',
  },
  {
    key: 'responseTime',
    question: 'Jak szybko odpowiadacie na zapytanie (czy tego samego dnia)?',
    impact:
      'Rozwiązano: obietnica „tego samego dnia” wyjęta z `home.ctaText` i `product.ctaText` ' +
      '(ui.ts) oraz z FAQ i delivery (pages.ts). Pozostaje do potwierdzenia realny czas ' +
      'odpowiedzi, jeśli chce go publikować.',
  },
  {
    key: 'contactEmail',
    question: 'Czy adres kontakt@doors-oblogi.pl jest właściwy?',
    impact: 'company.ts → `contactEmail` (provisional) i cała ścieżka `mailto:` formularza.',
  },
] as const;
