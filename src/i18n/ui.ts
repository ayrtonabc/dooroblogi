import type { Locale } from './index';

/**
 * Etykiety interfejsu. Płaska struktura: jeden klucz → tekst w każdym języku.
 * Dzięki temu widoki nie zawierają warunków `lang === 'pl'` rozsianych po komponentach.
 */
const ui = {
  // Nawigacja
  'nav.home': { pl: 'Start', en: 'Home', de: 'Start' },
  'nav.products': { pl: 'Produkty', en: 'Products', de: 'Produkte' },
  'nav.about': { pl: 'O nas', en: 'About', de: 'Über uns' },
  'nav.projects': { pl: 'Galeria', en: 'Gallery', de: 'Galerie' },
  'nav.priceList': { pl: 'Cennik i wycena', en: 'Price list & quote', de: 'Preisliste & Angebot' },
  /**
   * Versión corta para la barra superior. En alemán la larga no cabe: con
   * seis posiciones, la barra se iba de 1240 px y el botón de «Angebot
   * anfordern» se salía de la pantalla.
   */
  'nav.priceListShort': { pl: 'Cennik', en: 'Price list', de: 'Preisliste' },
  'nav.contact': { pl: 'Kontakt', en: 'Contact', de: 'Kontakt' },
  'nav.trade': { pl: 'Dla firm', en: 'For trade', de: 'Für Handwerk' },
  /** Versión corta para la barra superior — mismo motivo que arriba. */
  'nav.tradeShort': { pl: 'Dla firm', en: 'For trade', de: 'Handwerk' },
  'nav.delivery': { pl: 'Dostawa', en: 'Delivery', de: 'Lieferung' },
  'nav.menu': { pl: 'Menu', en: 'Menu', de: 'Menü' },
  'nav.close': { pl: 'Zamknij', en: 'Close', de: 'Schließen' },
  /** Link na końcu listy produktów w menu. */
  'nav.allProducts': { pl: 'Wszystkie produkty', en: 'All products', de: 'Alle Produkte' },
  'nav.skip': { pl: 'Przejdź do treści', en: 'Skip to content', de: 'Zum Inhalt springen' },

  // Akcje
  'cta.quote': { pl: 'Zapytaj o wycenę', en: 'Request a quote', de: 'Angebot anfordern' },
  'cta.call': { pl: 'Zadzwoń', en: 'Call us', de: 'Anrufen' },
  'cta.products': { pl: 'Zobacz produkty', en: 'See the products', de: 'Produkte ansehen' },
  'cta.details': { pl: 'Zobacz szczegóły', en: 'See details', de: 'Details ansehen' },
  'cta.allProducts': { pl: 'Wszystkie produkty', en: 'All products', de: 'Alle Produkte' },
  'cta.write': { pl: 'Napisz do nas', en: 'Write to us', de: 'Schreiben Sie uns' },

  // Formularz wyceny
  'form.title': { pl: 'Zapytanie o wycenę', en: 'Quote request', de: 'Angebotsanfrage' },
  'form.intro': {
    pl: 'Podaj wymiary i zastosowanie — odpowiadamy z cennikiem i terminem realizacji.',
    en: 'Give us the dimensions and the intended use — we reply with an individual quote and a lead time.',
    de: 'Nennen Sie Maße und Verwendungszweck — wir antworten mit einem individuellen Angebot und Lieferzeit.',
  },
  'form.name': { pl: 'Imię i nazwisko', en: 'Full name', de: 'Name' },
  'form.company': { pl: 'Firma (opcjonalnie)', en: 'Company (optional)', de: 'Firma (optional)' },
  'form.taxId': { pl: 'NIP (opcjonalnie)', en: 'Tax ID (optional)', de: 'Steuernummer (optional)' },
  'form.email': { pl: 'E-mail', en: 'Email', de: 'E-Mail' },
  'form.phone': { pl: 'Telefon', en: 'Phone', de: 'Telefon' },
  'form.product': { pl: 'Produkt', en: 'Product', de: 'Produkt' },
  'form.productSelect': { pl: 'Wybierz produkt', en: 'Select a product', de: 'Produkt wählen' },
  'form.other': { pl: 'Inne / nie wiem', en: 'Other / not sure', de: 'Sonstiges / unklar' },
  'form.message': { pl: 'Wymiary i zastosowanie', en: 'Dimensions and intended use', de: 'Maße und Verwendungszweck' },
  'form.messagePlaceholder': {
    pl: 'np. 3 m długości, przekrój 40 × 20 mm, listwy wykończeniowe do domku letniskiego',
    en: 'e.g. 3 m length, 40 × 20 mm section, trim battens for a holiday cottage',
    de: 'z. B. 3 m Länge, Querschnitt 40 × 20 mm, Abschlussleisten für ein Ferienhaus',
  },
  'form.consent': {
    pl: 'Wyrażam zgodę na kontakt w sprawie tego zapytania i akceptuję przetwarzanie danych w tym celu.',
    en: 'I agree to be contacted about this enquiry and accept the processing of my data for that purpose.',
    de: 'Ich bin mit der Kontaktaufnahme zu dieser Anfrage einverstanden und akzeptiere die Verarbeitung meiner Daten zu diesem Zweck.',
  },
  'form.submit': { pl: 'Wyślij zapytanie', en: 'Send enquiry', de: 'Anfrage senden' },
  'form.sending': { pl: 'Wysyłanie…', en: 'Sending…', de: 'Wird gesendet…' },
  'form.errorRequired': {
    pl: 'Uzupełnij zaznaczone pola — bez nich nie przygotujemy wyceny.',
    en: 'Please fill in the highlighted fields — we cannot prepare a quote without them.',
    de: 'Bitte füllen Sie die markierten Felder aus — ohne sie können wir kein Angebot erstellen.',
  },
  'form.fieldRequired': {
    pl: 'To pole jest wymagane.',
    en: 'This field is required.',
    de: 'Dieses Feld ist erforderlich.',
  },
  'form.fieldEmail': {
    pl: 'Podaj poprawny adres e-mail.',
    en: 'Please enter a valid email address.',
    de: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
  },
  'form.fieldConsent': {
    pl: 'Zgoda jest konieczna, żebyśmy mogli się skontaktować.',
    en: 'We need your consent before we can get in touch.',
    de: 'Ohne Ihre Einwilligung können wir Sie nicht kontaktieren.',
  },
  'form.mailSubject': {
    pl: 'Zapytanie o wycenę — Doors Obłogi',
    en: 'Quote request — Doors Obłogi',
    de: 'Angebotsanfrage — Doors Obłogi',
  },
  'form.errorEmail': {
    pl: 'Podaj poprawny adres e-mail albo zadzwoń — odpowiadamy również telefonicznie.',
    en: 'Enter a valid email address, or call us — we also reply by phone.',
    de: 'Geben Sie eine gültige E-Mail-Adresse ein oder rufen Sie an — wir antworten auch telefonisch.',
  },
  /**
   * Wynik po wysłaniu do endpointu — zapytanie NAPRAWDĘ dotarło.
   * Osobny komunikat od `form.successMailto`, bo ten drugi oznacza tylko
   * „otworzyliśmy Twój program pocztowy", a nie „zapytanie jest u nas".
   */
  'form.successSent': {
    pl: 'Zapytanie dotarło do nas. Odpowiemy e-mailem na podany adres — wyślemy wycenę i termin realizacji.',
    en: 'Your enquiry has reached us. We reply by email to the address you gave — with the quote and the lead time.',
    de: 'Ihre Anfrage ist bei uns angekommen. Wir antworten per E-Mail an die angegebene Adresse — mit Angebot und Lieferzeit.',
  },
  /**
   * Wynik bez endpointu: otworzyliśmy klienta poczty z gotową treścią.
   * Wiadomość NIE jest jeszcze wysłana — trzeba ją wysłać. Mówimy to
   * wprost i dajemy dwa wyjścia awaryjne (WhatsApp i telefon).
   */
  'form.successMailto': {
    pl: 'Otworzyliśmy Twój program pocztowy z gotowym zapytaniem. Wyślij tę wiadomość, żeby do nas dotarła.',
    en: 'We opened your mail app with the enquiry ready. Send that message so it reaches us.',
    de: 'Wir haben Ihr E-Mail-Programm mit der fertigen Anfrage geöffnet. Senden Sie die Nachricht, damit sie uns erreicht.',
  },
  /** Tytuł bloku wyniku — wspólny dla obu wyjść. */
  'form.resultTitle': {
    pl: 'Zapytanie gotowe',
    en: 'Your enquiry is ready',
    de: 'Ihre Anfrage ist fertig',
  },
  /**
   * Tytuł bloku wyniku, gdy zapytanie JUŻ poszło przez sieć (endpoint
   * ustawiony). Inny niż poprzedni celowo: «gotowe» to zlecenie,
   * «wysłane» to fakt.
   */
  'form.resultTitleSent': {
    pl: 'Zapytanie wysłane',
    en: 'Enquiry sent',
    de: 'Anfrage gesendet',
  },
  'form.errorGeneric': {
    pl: 'Nie udało się wysłać formularza. Zadzwoń lub napisz bezpośrednio — odpowiadamy w godzinach pracy.',
    en: 'The form could not be sent. Call or write to us directly — we answer during working hours.',
    de: 'Das Formular konnte nicht gesendet werden. Rufen Sie an oder schreiben Sie direkt — wir antworten während der Geschäftszeiten.',
  },
  'form.altContact': {
    pl: 'Preferujesz telefon?',
    en: 'Would rather call?',
    de: 'Lieber anrufen?',
  },
  'form.whatsapp': {
    pl: 'Wyślij zapytanie przez WhatsApp',
    en: 'Send the enquiry via WhatsApp',
    de: 'Anfrage per WhatsApp senden',
  },
  'form.whatsappHint': {
    pl: 'Otworzy WhatsAppa z gotową treścią zapytania.',
    en: 'Opens WhatsApp with your enquiry text ready to send.',
    de: 'Öffnet WhatsApp mit fertigem Anfragetext.',
  },
  'form.noJs': {
    pl: 'Nie działa formularz? Napisz na WhatsApp albo zadzwoń — odpowiadamy w godzinach pracy.',
    en: 'Does the form not work? Write on WhatsApp or call — we answer during working hours.',
    de: 'Funktioniert das Formular nicht? Schreiben Sie per WhatsApp oder rufen Sie an — wir antworten während der Geschäftszeiten.',
  },

  // Etykiety w treści wiadomości (e-mail / WhatsApp).
  // Klucze pól formularza (name, company, taxId…) pozostają po angielsku —
  // to kontrakt z endpointem, opisany w docs/CMS-INTEGRATION.md.
  'form.body.name': { pl: 'Imię i nazwisko', en: 'Full name', de: 'Name' },
  'form.body.company': { pl: 'Firma', en: 'Company', de: 'Firma' },
  'form.body.taxId': { pl: 'NIP', en: 'Tax ID', de: 'Steuernummer' },
  'form.body.email': { pl: 'E-mail', en: 'Email', de: 'E-Mail' },
  'form.body.phone': { pl: 'Telefon', en: 'Phone', de: 'Telefon' },
  'form.body.product': { pl: 'Produkt', en: 'Product', de: 'Produkt' },
  'form.body.message': { pl: 'Wiadomość', en: 'Message', de: 'Nachricht' },
  'form.body.attachments': { pl: 'Załączniki', en: 'Attachments', de: 'Anhänge' },
  'form.attachmentLabel': {
    pl: 'Chcę dołączyć rysunek lub zdjęcie',
    en: 'I want to attach a drawing or a photo',
    de: 'Ich möchte eine Zeichnung oder ein Foto anhängen',
  },
  'form.attachmentOptional': { pl: '(opcjonalnie)', en: '(optional)', de: '(optional)' },
  'form.attachmentHint': {
    pl: 'Przeciągnij plik lub wybierz z dysku.',
    en: 'Drag a file here or pick it from your disk.',
    de: 'Datei hierher ziehen oder von der Festplatte wählen.',
  },
  'form.attachmentButton': {
    pl: 'Wybierz plik',
    en: 'Choose a file',
    de: 'Datei wählen',
  },
  'form.attachmentNote': {
    pl: 'Do zapytania dojdzie nazwa pliku — sam plik wyślij na WhatsApp albo e-mail.',
    en: 'The file name will be included in the enquiry — send the file itself via WhatsApp or email.',
    de: 'Der Dateiname kommt mit der Anfrage — die Datei selbst senden Sie über WhatsApp oder per E-Mail.',
  },
  /** Skąd przyszło zapytanie — do pomiaru i do klienta. */
  'form.body.context': { pl: 'Źródło', en: 'Source', de: 'Quelle' },
  /** Zakres zapytania — który embudo wybrał gość. */
  'form.body.funnel': { pl: 'Zakres zapytania', en: 'Enquiry scope', de: 'Anfrageumfang' },
  /** Miejsce dostawy. */
  'form.body.place': { pl: 'Miejsce dostawy', en: 'Delivery place', de: 'Lieferort' },
  /** Dowód zgody (RODO art. 7.1) w treści wiadomości. */
  'form.body.consent': {
    pl: 'Zgoda na kontakt w sprawie tej wyceny',
    en: 'Consent to be contacted about this quote',
    de: 'Einwilligung zur Kontaktaufnahme zu diesem Angebot',
  },
  /** Strona, z której przyszło zapytanie. */
  'form.body.page': { pl: 'Strona', en: 'Page', de: 'Seite' },
  /** Język strony, z której przyszło zapytanie. */
  'form.body.locale': { pl: 'Język', en: 'Language', de: 'Sprache' },
  /** Nazwy embudów — w treści wiadomości i w nagłówku formularza. */
  'form.funnelA': {
    pl: 'Panele sufitowe i ścienne',
    en: 'Ceiling and wall panels',
    de: 'Decken- und Wandpaneele',
  },
  'form.funnelB': {
    pl: 'Obłogi i lamele',
    en: 'Trim battens and slats',
    de: 'Abschlussleisten und Lamellen',
  },

  // Sekcje

  // Dane kontaktowe
  'contact.phone': { pl: 'Telefon', en: 'Phone', de: 'Telefon' },
  'contact.person': { pl: 'Kontakt handlowy', en: 'Sales contact', de: 'Vertriebskontakt' },
  // Etykieta godzin zmieniona z „Godziny kontaktu" na „Odpowiadamy":
  // klient nie potwierdził godzin, więc wiersz nie może obiecywać godzin.
  'contact.hours': { pl: 'Odpowiadamy', en: 'We reply', de: 'Wir antworten' },
  'contact.delivery': { pl: 'Dostawa', en: 'Delivery', de: 'Lieferung' },
  'contact.address': { pl: 'Adres', en: 'Address', de: 'Adresse' },
  'contact.email': { pl: 'E-mail', en: 'Email', de: 'E-Mail' },
  'contact.map': { pl: 'Zobacz na mapie', en: 'View on the map', de: 'Auf der Karte ansehen' },
  'contact.location': { pl: 'Miejsce', en: 'Location', de: 'Ort' },
  'contact.faqTitle': {
    pl: 'Zanim zadzwonisz',
    en: 'Before you call',
    de: 'Bevor Sie anrufen',
  },

  // Katalog produktów (/produkty/)
  'catalog.range': { pl: 'Oferta', en: 'Range', de: 'Sortiment' },
  'catalog.tradeTitle': {
    pl: 'Dla stolarzy i firm wykończeniowych',
    en: 'For joiners and fit-out companies',
    de: 'Für Schreinere und Ausbauunternehmen',
  },
  'catalog.tradeLede': {
    pl: 'Stały profil i selekcja drewna między partiami, wycena na całą partię, dostawa kurierem w całej Polsce.',
    en: 'The same profile and selection across batches, a quote for the whole batch, courier delivery within Poland.',
    de: 'Gleiches Profil und dieselbe Selektion über Chargen hinweg, ein Angebot für die ganze Charge, Lieferung per Kurier in ganz Polen.',
  },
  'catalog.tradeCardTitle': {
    pl: 'Zapytanie hurtowe',
    en: 'Trade enquiry',
    de: 'Großhandelsanfrage',
  },
  'catalog.tradeCardText': {
    pl: 'Opisz profil, długość i ilość na całą partię — wyceniamy jednostkę i całość osobno.',
    en: 'Describe the profile, the length and the quantity for the whole batch — we quote the unit and the batch separately.',
    de: 'Beschreiben Sie Profil, Länge und Menge für die ganze Charge — wir kalkulieren Einheit und Charge getrennt.',
  },
  'catalog.faqTitle': {
    pl: 'Pytania o obłogi, lamele i panele',
    en: 'Questions about trim battens, oak battens and panels',
    de: 'Fragen zu Abschlussleisten, Lamellen und Paneelen',
  },
  'catalog.ctaTitle': {
    pl: 'Nie widzisz, czego szukasz?',
    en: 'Not finding what you need?',
    de: 'Nicht das Richtige gefunden?',
  },
  'catalog.ctaText': {
    pl: 'Opisz zastosowanie — często da się dobrać profil, którego nie ma w katalogu, bo robimy je na wymiar.',
    en: 'Describe the application — we can often supply a profile that is not in the range, because we cut to size.',
    de: 'Beschreiben Sie die Anwendung — oft lässt sich ein Profil liefern, das nicht im Katalog steht, weil wir auf Maß fertigen.',
  },

  // Strona produktu
  'product.kicker': { pl: 'Produkt', en: 'Product', de: 'Produkt' },
  'product.specsKicker': {
    pl: 'Dane techniczne',
    en: 'Specifications',
    de: 'Technische Daten',
  },
  'product.specsTitle': {
    pl: 'Co dostajesz',
    en: 'What you get',
    de: 'Was Sie bekommen',
  },
  'product.whyKicker': { pl: 'Dlaczego', en: 'Why', de: 'Warum' },
  'product.whyTitle': {
    pl: 'Trzy powody, dla których się tu wybierają',
    en: 'Three reasons people choose this',
    de: 'Drei Gründe für die Wahl',
  },
  'product.priceKicker': { pl: 'Cena', en: 'Price', de: 'Preis' },
  'product.priceTitle': {
    pl: 'Ile kosztuje i od czego zależy',
    en: 'What it costs and what it depends on',
    de: 'Was es kostet und wovon es abhängt',
  },
  /**
   * Cierre de la rejilla de datos de la ficha: el titular centrado con
   * reglas a los lados, como en el resto de bloques del sitio.
   */
  'product.factsCtaTitle': {
    pl: 'Masz projekt?',
    en: 'Got a project?',
    de: 'Ein Projekt?',
  },
  'product.factsCtaText': {
    pl: 'Przygotujemy indywidualną wycenę.',
    en: 'We will prepare an individual quote.',
    de: 'Wir erstellen ein individuelles Angebot.',
  },
  /**
   * Cierre de la banda «Co dostajesz»: qué se ajusta al pedido y qué pasa
   * después. Es el puente hacia la banda de precio.
   */
  'product.specsClose': {
    pl: 'Profil i selekcja dobieramy pod Twoje zamówienie.',
    en: 'We match the profile and the selection to your order.',
    de: 'Profil und Selektion passen wir an Ihre Bestellung an.',
  },
  /** Cierre de la banda «Dlaczego»: qué se confirma en la oferta. */
  'product.whyClose': {
    pl: 'Wszystko potwierdzamy w wycenie: profil, selekcja i termin.',
    en: 'We confirm everything in the quote: the profile, the selection and the lead time.',
    de: 'Wir bestätigen alles im Angebot: Profil, Selektion und Lieferzeit.',
  },
  /** Botón secundario: llevar a la galería de la propia ficha. */
  'product.photosLink': {
    pl: 'Zobacz zdjęcia',
    en: 'See the photos',
    de: 'Fotos ansehen',
  },
  'product.photosKicker': { pl: 'Zdjęcia', en: 'Photos', de: 'Fotos' },
  'product.photosTitle': {
    pl: '{name} w detalu',
    en: '{name} up close',
    de: '{name} im Detail',
  },
  'product.quoteKicker': { pl: 'Wycena', en: 'Quote', de: 'Angebot' },
  'product.quoteTitle': {
    pl: 'Zapytaj o cenę tego materiału',
    en: 'Ask for a price on this material',
    de: 'Preis für dieses Material anfragen',
  },
  'product.quoteLede': {
    pl: 'Cennik zależy od profilu, długości, grubości i ilości, więc wyceniamy indywidualnie. Opisz, co robisz, a odpowiedź dostaniesz e-mailem.',
    en: 'The price list depends on profile, length, thickness and quantity, so we quote individually. Describe what you are building and the answer comes by email.',
    de: 'Die Preisliste hängt von Profil, Länge, Stärke und Menge ab, deshalb kalkulieren wir individuell. Beschreiben Sie Ihr Projekt — die Antwort kommt per E-Mail.',
  },
  'product.seeAlsoKicker': {
    pl: 'Zobacz też',
    en: 'See also',
    de: 'Ebenfalls erhältlich',
  },
  'product.seeAlsoTitle': {
    pl: 'Pozostałe produkty',
    en: 'Other products',
    de: 'Weitere Produkte',
  },
  'product.ctaTitle': {
    pl: 'Masz wymiary? Napisz',
    en: 'Got the dimensions? Write to us',
    de: 'Maße parat? Schreiben Sie uns',
  },
  'product.ctaText': {
    pl: 'Długość, przekrój, ilość — wystarczy. Przygotujemy indywidualną wycenę z terminem realizacji.',
    en: 'Length, section, quantity — that is all we need. We prepare an individual quote with the lead time.',
    de: 'Länge, Querschnitt, Menge — mehr brauchen wir nicht. Wir erstellen ein individuelles Angebot mit Lieferzeit.',
  },

  // Strona "O nas"
  'about.ctaTitle': {
    pl: 'Zobaczmy, co z tego wyjdzie',
    en: 'Let us see what comes out of it',
    de: 'Lassen Sie uns sehen, was daraus wird',
  },
  'about.ctaText': {
    pl: 'Przyślij wymiary i zastosowanie — wycenimy materiał i podamy termin realizacji.',
    en: 'Send the dimensions and the application — we will quote the material and give you a lead time.',
    de: 'Senden Sie Maße und Anwendung — wir kalkulieren das Material und nennen den Liefertermin.',
  },

  // Strona główna
  'home.ctaTitle': {
    pl: 'Powiedz, co chcesz zrobić z drewnem',
    en: 'Tell us what you want to build with wood',
    de: 'Sagen Sie uns, was Sie aus Holz bauen wollen',
  },
  'home.ctaText': {
    pl: 'Wymiary, zastosowanie, ilość — przygotujemy indywidualną wycenę z terminem realizacji.',
    en: 'Dimensions, application, quantity — we prepare an individual quote with the lead time.',
    de: 'Maße, Anwendung, Menge — wir erstellen ein individuelles Angebot mit Lieferzeit.',
  },

  // Dostawa
  'delivery.shippingInPoland': {
    pl: 'Wysyłka w Polsce',
    en: 'Shipping in Poland',
    de: 'Versand in Polen',
  },
  'delivery.outsidePoland': {
    pl: 'Poza Polską',
    en: 'Outside Poland',
    de: 'Außerhalb Polens',
  },
  'delivery.ctaTitle': {
    pl: 'Sprawdź termin dla swojego zamówienia',
    en: 'Check the lead time for your order',
    de: 'Prüfen Sie die Lieferzeit für Ihre Bestellung',
  },
  'delivery.ctaText': {
    pl: 'Podaj profil, długość i ilość — termin realizacji podajemy w wycenie.',
    en: 'Give the profile, the length and the quantity — we state the lead time in the quote.',
    de: 'Nennen Sie Profil, Länge und Menge — die Lieferzeit nennen wir im Angebot.',
  },

  // Galeria
  'gallery.ctaTitle': {
    pl: 'Chcesz takie drewno u siebie?',
    en: 'Want this wood in your project?',
    de: 'Dieses Holz in Ihrem Projekt?',
  },
  'gallery.ctaText': {
    pl: 'Opisz wymiary i zastosowanie — przygotujemy indywidualną wycenę z terminem realizacji.',
    en: 'Describe the dimensions and the application — we will prepare an individual quote and a lead time.',
    de: 'Beschreiben Sie Maße und Anwendung — wir senden Preisliste und Liefertermin.',
  },

  // Stopka
  'footer.about': {
    pl: 'Dębowe obłogi, lamele i gotowe panele sufitowe i ścienne. Naturalny dąb, cięcie na wymiar, wysyłka w całej Polsce.',
    en: 'Oak trim battens, oak battens and ready-made ceiling and wall panels. Natural oak, cut to size, courier delivery within Poland.',
    de: 'Eichen-Abschlussleisten, Lamellen und fertige Decken- und Wandpaneele. Natürliche Eiche, auf Maß geschnitten, Versand per Kurier innerhalb Polens.',
  },
  'footer.trim': {
    pl: 'Listwy wykończeniowe',
    en: 'Trim battens',
    de: 'Abschlussleisten',
  },
  'footer.slats': { pl: 'Lamele 4–8 mm', en: 'Battens 4–8 mm', de: 'Lamellen 4–8 mm' },
  'footer.panels': {
    pl: 'Panele sufitowe i ścienne',
    en: 'Ceiling and wall panels',
    de: 'Decken- und Wandpaneele',
  },

  // Tekst powitalny WhatsApp
  'wa.quote': {
    pl: 'Cześć, chciałbym zapytać o wycenę obłogów dębowych.',
    en: 'Hello, I would like to ask for a quote for oak trim battens.',
    de: 'Hallo, ich möchte ein Angebot für Eichen-Abschlussleisten anfragen.',
  },
  'wa.product': {
    pl: 'Cześć, chciałbym zapytać o {product}.',
    en: 'Hello, I would like to ask for a quote for {product}.',
    de: 'Hallo, ich möchte ein Angebot für {product} anfragen.',
  },
  'wa.delivery': {
    pl: 'Cześć, chciałbym zapytać o dostawę obłogów dębowych.',
    en: 'Hello, I would like to ask about delivery for oak trim battens.',
    de: 'Hallo, ich möchte die Lieferung von Eichen-Abschlussleisten klären.',
  },
  'wa.trade': {
    pl: 'Cześć, chciałbym zapytać o wycenę hurtową obłogów dębowych.',
    en: 'Hello, I would like to ask for a trade quote for oak trim battens.',
    de: 'Hallo, ich möchte ein Großhandelsangebot für Eichen-Abschlussleisten anfragen.',
  },

  // SEO / techniczne
  'seo.faqKicker': { pl: 'FAQ', en: 'FAQ', de: 'FAQ' },
  'seo.faqTitle': {
    pl: 'Najczęstsze pytania o obłogi dębowe',
    en: 'Frequently asked questions about oak trim battens',
    de: 'Häufige Fragen zu Eichen-Abschlussleisten',
  },
  'seo.priceTitle': {
    pl: 'Jak wyceniamy obłogi dębowe',
    en: 'How we price oak trim battens',
    de: 'So kalkulieren wir Eichen-Abschlussleisten',
  },
  'seo.technicalTitle': {
    pl: 'Dane techniczne drewna',
    en: 'Wood technical data',
    de: 'Technische Daten zum Holz',
  },
  'seo.unitTitle': {
    pl: 'Jednostka sprzedaży',
    en: 'Sales unit',
    de: 'Verkaufseinheit',
  },
  'seo.factorsTitle': {
    pl: 'Od czego zależy cena',
    en: 'What the price depends on',
    de: 'Wovon der Preis abhängt',
  },
  /**
   * Tercera fila del bloque de precio: qué abarca la oferta del producto
   * concreto (texto por producto en `pricing.ts`).
   */
  'seo.includesTitle': {
    pl: 'Co obejmuje wycena',
    en: 'What the quote covers',
    de: 'Was das Angebot umfasst',
  },
  'seo.priceContact': {
    pl: 'Ceny nie publikujemy — wyślij zapytanie, a podamy cenę za jednostkę sprzedaży.',
    en: 'We do not publish prices — send an enquiry and we will state the price per sales unit.',
    de: 'Wir veröffentlichen keine Preise — senden Sie eine Anfrage, wir nennen den Preis je Verkaufseinheit.',
  },
  'specs.confirmedInQuote': {
    pl: '— potwierdzamy w wycenie',
    en: '— confirmed in the quote',
    de: '— bestätigen wir im Angebot',
  },
  'footer.rights': { pl: 'Wszelkie prawa zastrzeżone.', en: 'All rights reserved.', de: 'Alle Rechte vorbehalten.' },
  'footer.production': { pl: 'Obróbka drewna', en: 'Wood processing', de: 'Holzbearbeitung' },
  'footer.nav': { pl: 'Nawigacja', en: 'Navigation', de: 'Navigation' },
  'footer.contact': { pl: 'Kontakt', en: 'Contact', de: 'Kontakt' },
  'footer.cookies': { pl: 'Polityka prywatności', en: 'Privacy policy', de: 'Datenschutz' },
  'footer.language': { pl: 'Język', en: 'Language', de: 'Sprache' },
} satisfies Record<string, Record<Locale, string>>;

export type UiKey = keyof typeof ui;

export function t(locale: Locale, key: UiKey): string {
  return ui[key][locale];
}

/** Tłumaczy zdanie zawierające placeholdery `{name}`. */
export function tf(locale: Locale, key: UiKey, vars: Record<string, string | number>): string {
  return t(locale, key).replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`));
}
