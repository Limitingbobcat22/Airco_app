/** Bedrijfsgegevens voor footer en juridische pagina’s. */
export const COMPANY = {
  name: 'Airco & Warmte',
  tagline: 'Klimaattechniek en duurzame warmte',
  description:
    'Aircos en ketels, vakkundig geplaatst door onze eigen monteurs. Koel in de zomer, bespaar in de winter.',
  email: 'info@aircoenwarmte.nl',
  phoneDisplay: '06 12 34 56 78',
  phoneHref: 'tel:+31612345678',
  addressLines: ['Nederland'],
  kvk: '12345678',
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
  ],
} as const

export const LEGAL_PATHS = {
  privacy: '/privacy',
  terms: '/voorwaarden',
  cookies: '/cookies',
} as const

export const LEGAL_PAGES = {
  privacy: {
    title: 'Privacybeleid',
    intro:
      'Airco & Warmte gaat zorgvuldig om met persoonsgegevens. We gebruiken uw gegevens alleen om contact op te nemen over een offerte of advies.',
  },
  terms: {
    title: 'Algemene voorwaarden',
    intro:
      'Offertes via deze website zijn vrijblijvend. Afspraak, prijs en installatie leggen we altijd schriftelijk vast voordat we aan het werk gaan.',
  },
  cookies: {
    title: 'Cookiebeleid',
    intro:
      'Deze website gebruikt functionele cookies die nodig zijn om de site te laten werken, bijvoorbeeld voor inloggen. We plaatsen geen trackingcookies voor advertenties.',
  },
} as const
