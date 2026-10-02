/** Bedrijfsgegevens voor footer en juridische popups. */
export const COMPANY = {
  name: 'Airco & Warmte',
  tagline: 'Klimaattechniek en duurzame warmte',
  description:
    'Aircos en ketels, vakkundig geplaatst door onze eigen monteurs. Fris in de zomer, voordelig in de winter.',
  email: 'info@aircoenwarmte.nl',
  phoneDisplay: '+31644454681',
  phoneHref: 'tel:+31644454681',
  addressLines: ['Nederland'],
  kvk: '42174382',
  vat: 'NL001234567B01',
  socials: [
    {
      id: 'instagram',
      label: 'Instagram',
      href: 'https://www.instagram.com/aircoenwarmte',
    },
    {
      id: 'tiktok',
      label: 'TikTok',
      href: 'https://www.tiktok.com/@aircoenwarmte',
    },
    {
      id: 'facebook',
      label: 'Facebook',
      href: 'https://www.facebook.com/aircoenwarmte',
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      href: 'https://wa.me/31644454681',
    },
  ],
} as const

export const LEGAL_PAGES = {
  privacy: {
    title: 'Privacybeleid',
    intro:
      'Airco & Warmte gaat zorgvuldig om met persoonsgegevens. We gebruiken uw gegevens alleen om contact op te nemen over een offerte of advies. In dit privacybeleid leggen we uit welke gegevens we verzamelen en hoe we hiermee omgaan.',
    articles: [
      {
        title: '1. Welke persoonsgegevens verwerken wij?',
        lead: 'Wanneer u gebruikmaakt van onze website (bijvoorbeeld via onze rekentool), een offerte opvraagt of contact met ons opneemt, kunnen wij de volgende gegevens van u verwerken:',
        bullets: true,
        items: [
          'Voor- en achternaam',
          'Adresgegevens (voor een eventuele installatie of schouw)',
          'Telefoonnummer',
          'E-mailadres',
          'Gegevens die u invult in onze rekentool met betrekking tot uw ruimte',
        ],
      },
      {
        title: '2. Waarvoor gebruiken wij deze gegevens?',
        lead: 'Wij verwerken uw persoonsgegevens uitsluitend voor de volgende doelen:',
        bullets: true,
        items: [
          'Om uw aanvraag via de rekentool te kunnen verwerken.',
          'Om contact met u op te kunnen nemen via telefoon of e-mail over een offerte of persoonlijk advies.',
          'Om onze diensten bij u te kunnen uitvoeren (zoals het inplannen en uitvoeren van een installatie).',
          'Voor het afhandelen van de betaling/facturatie.',
        ],
      },
      {
        title: '3. Hoe lang bewaren wij uw gegevens?',
        lead: 'Airco & Warmte bewaart uw persoonsgegevens niet langer dan strikt nodig is om de doelen te realiseren waarvoor de gegevens worden verzameld. Als er geen overeenkomst tot stand komt, verwijderen wij uw aanvraag en contactgegevens binnen afzienbare tijd. Indien er wel een overeenkomst tot stand komt, bewaren wij de noodzakelijke gegevens (zoals facturen) zolang de wet ons dat verplicht (bijvoorbeeld voor de Belastingdienst).',
      },
      {
        title: '4. Delen van persoonsgegevens met derden',
        lead: 'Uw privacy is belangrijk voor ons. Wij verkopen uw gegevens niet aan derden. Wij delen uw gegevens uitsluitend als dit noodzakelijk is voor de uitvoering van onze afspraken (bijvoorbeeld met een leverancier of installatiepartner, indien van toepassing) of om te voldoen aan een wettelijke verplichting.',
      },
      {
        title: '5. Cookies of vergelijkbare technieken',
        lead: 'Airco & Warmte gebruikt geen cookies of vergelijkbare technieken op deze website. Wij plaatsen geen functionele, analytische of trackingcookies en volgen uw surfgedrag niet.',
      },
      {
        title: '6. Gegevens inzien, aanpassen of verwijderen',
        lead: `U heeft altijd het recht om uw persoonsgegevens in te zien, te corrigeren of te verwijderen. Wilt u gebruikmaken van dit recht, of heeft u vragen over ons privacybeleid? Stuur dan een e-mail naar ${COMPANY.email}. Wij verwerken uw verzoek zo snel mogelijk.`,
      },
    ],
  },
  terms: {
    title: 'Algemene voorwaarden',
    articles: [
      {
        title: 'Artikel 1. Definities',
        lead: 'In deze algemene voorwaarden wordt verstaan onder:',
        items: [
          'Airco & Warmte: de opdrachtnemer.',
          'Klant: de natuurlijke of rechtspersoon die een overeenkomst aangaat met Airco & Warmte of gebruikmaakt van de website.',
          'Diensten/Producten: de levering en/of installatie van airconditioningsystemen en aanverwante artikelen door Airco & Warmte.',
        ],
      },
      {
        title: 'Artikel 2. Toepasselijkheid',
        lead: 'Deze algemene voorwaarden zijn van toepassing op elk aanbod van Airco & Warmte, alle offertes, afspraken en elke tot stand gekomen overeenkomst tussen Airco & Warmte en de klant.',
      },
      {
        title: 'Artikel 3. Offertes en aanbiedingen',
        items: [
          'Offertes via deze website zijn vrijblijvend.',
          'Een aanbod of offerte is geldig gedurende de daarin aangegeven termijn. Indien er geen termijn is aangegeven, is de offerte 14 dagen geldig.',
          'Airco & Warmte kan niet aan een offerte worden gehouden indien de klant redelijkerwijs kan begrijpen dat de offerte een kennelijke vergissing of verschrijving bevat.',
        ],
      },
      {
        title: 'Artikel 4. Totstandkoming van de overeenkomst en installatie',
        items: [
          'Om misverstanden te voorkomen, werken wij met heldere afspraken. Afspraak, prijs en installatie leggen we altijd schriftelijk vast voordat we aan het werk gaan.',
          'Pas na akkoord op deze schriftelijke bevestiging door beide partijen is de overeenkomst definitief.',
          'De klant draagt er zorg voor dat alle gegevens en voorzieningen (zoals toegankelijkheid van de ruimte en stroomvoorziening), die noodzakelijk zijn voor het uitvoeren van de installatie, tijdig aan Airco & Warmte worden verstrekt.',
        ],
      },
      {
        title: 'Artikel 5. Prijzen en betaling',
        items: [
          'Alle vermelde prijzen op de website en in offertes zijn inclusief btw (tenzij anders vermeld voor zakelijke klanten) en exclusief eventuele onvoorziene meerwerkkosten.',
          'Eventueel meerwerk dat tijdens de installatie noodzakelijk blijkt te zijn, wordt altijd vooraf met de klant besproken en pas na akkoord uitgevoerd.',
          'Betaling dient te geschieden binnen 14 dagen na factuurdatum, op een door Airco & Warmte aan te geven wijze, tenzij schriftelijk anders is overeengekomen.',
        ],
      },
      {
        title: 'Artikel 6. Garantie en onderhoud',
        items: [
          "Airco & Warmte garandeert dat de geleverde producten (zoals Haier en Mitsubishi airco's) en de installatie daarvan voldoen aan de gebruikelijke eisen en normen.",
          'Voor de geleverde apparatuur geldt de fabrieksgarantie van de betreffende fabrikant.',
          'De garantie vervalt indien een gebrek is ontstaan als gevolg van onoordeelkundig of oneigenlijk gebruik, of wanneer onderhoud door derden is uitgevoerd zonder schriftelijke toestemming van Airco & Warmte.',
        ],
      },
      {
        title: 'Artikel 7. Disclaimer website en capaciteitsberekening',
        items: [
          'Airco & Warmte besteedt de grootst mogelijke zorg aan de betrouwbaarheid en actualiteit van de gegevens op haar website. Onjuistheden en onvolledigheden kunnen echter voorkomen.',
          'Disclaimer: Het getoonde vermogen is een theoretische berekening op basis van de door u ingevoerde gegevens. Aan deze uitkomst kunnen geen rechten worden ontleend.',
          `Voor vragen over de berekening, een exact advies op maat of andere zaken, kunt u altijd contact met ons opnemen via ${COMPANY.email}.`,
        ],
      },
      {
        title: 'Artikel 8. Aansprakelijkheid',
        items: [
          'Indien Airco & Warmte aansprakelijk mocht zijn, dan is deze aansprakelijkheid beperkt tot hetgeen in deze bepaling is geregeld.',
          'Airco & Warmte is niet aansprakelijk voor schade, van welke aard ook, ontstaan doordat Airco & Warmte is uitgegaan van door of namens de klant verstrekte onjuiste en/of onvolledige gegevens.',
          'De aansprakelijkheid van Airco & Warmte is in ieder geval steeds beperkt tot het bedrag der uitkering van haar verzekeraar in voorkomend geval, dan wel tot maximaal het factuurbedrag van de betreffende opdracht.',
        ],
      },
      {
        title: 'Artikel 9. Toepasselijk recht en geschillen',
        lead: 'Op alle rechtsbetrekkingen waarbij Airco & Warmte partij is, is uitsluitend het Nederlands recht van toepassing.',
      },
    ],
  },
  cookies: {
    title: 'Cookiebeleid',
    intro:
      'Deze website gebruikt functionele cookies die nodig zijn om de site te laten werken, bijvoorbeeld voor inloggen. We plaatsen geen trackingcookies voor advertenties.',
  },
} as const
