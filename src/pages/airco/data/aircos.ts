export type EnergyClass = 'A+++' | 'A++' | 'A+'

export type Airco = {
  id: string
  brand: string
  series: string
  model: string
  tag: string
  description: string
  features: string[]
  coolingKwMin: number
  coolingKwMax: number
  heatingKw: number
  seer: number
  scop: number
  energyClassCooling: EnergyClass
  energyClassHeating: EnergyClass
  noiseSilentDba: number
  minTempC: number
  refrigerant: 'R32'
  roomM2: string
  heatingCoverage: number
  priceEur: number
  accent: string
}

export const AIRCOS: Airco[] = [
  {
    id: 'haier-pearl',
    brand: 'Haier',
    series: 'Pearl',
    model: 'Wandmodel',
    tag: 'Instapmodel & Populair',
    description:
      'Compact, strak mat wit design en voorzien van slimme Wi-Fi bediening en Coanda Plus luchtstroom. Een betrouwbare instapper die uw woning zuinig koelt en in het voor- en najaar verwarmt.',
    features: [
      'Energielabel A++ / A++',
      'Slechts 18 dB(A) fluisterstil',
      'Steri-Clean 56°C technologie',
      'Standaard ingebouwde Wi-Fi',
    ],
    coolingKwMin: 2.7,
    coolingKwMax: 7.1,
    heatingKw: 7.4,
    seer: 8.5,
    scop: 4.6,
    energyClassCooling: 'A+++',
    energyClassHeating: 'A++',
    noiseSilentDba: 18,
    minTempC: -20,
    refrigerant: 'R32',
    roomM2: 'tot 40 m²',
    heatingCoverage: 0.55,
    priceEur: 2190,
    accent: '#005A9C',
  },
  {
    id: 'haier-flexis-plus',
    brand: 'Haier',
    series: 'Flexis Plus',
    model: 'Wandmodel',
    tag: 'Meest Verkocht',
    description:
      'Luxe uitvoering verkrijgbaar in mat wit en mat zwart. Voorzien van Eco-sensor voor maximaal comfort, UV-C luchtreiniging en een stil, energiezuinig klimaat het hele jaar door.',
    features: [
      'Luxe designafwerking in wit & zwart',
      'UV-C Luchtzuivering',
      'Eco-Sensor energiebesparing',
      'Ingebouwde Wi-Fi module',
    ],
    coolingKwMin: 2.6,
    coolingKwMax: 7.0,
    heatingKw: 8.0,
    seer: 8.5,
    scop: 4.6,
    energyClassCooling: 'A+++',
    energyClassHeating: 'A++',
    noiseSilentDba: 17,
    minTempC: -20,
    refrigerant: 'R32',
    roomM2: 'tot 40 m²',
    heatingCoverage: 0.58,
    priceEur: 2690,
    accent: '#005A9C',
  },
  {
    id: 'haier-revive',
    brand: 'Haier',
    series: 'Revive',
    model: 'Wandmodel',
    tag: 'Voordelig & Efficient',
    description:
      'Het perfecte basismodel voor snelle koeling en verwarming met een uitstekende prijs-kwaliteitverhouding. Degelijk, zuinig en eenvoudig te bedienen via de app.',
    features: [
      'Energielabel A++ / A+',
      'Snelle koeling & verwarming',
      'hOn Smart App bediening',
      'Eenvoudig onderhoud',
    ],
    coolingKwMin: 2.7,
    coolingKwMax: 6.2,
    heatingKw: 6.3,
    seer: 6.1,
    scop: 4.0,
    energyClassCooling: 'A++',
    energyClassHeating: 'A+',
    noiseSilentDba: 19,
    minTempC: -20,
    refrigerant: 'R32',
    roomM2: 'tot 40 m²',
    heatingCoverage: 0.5,
    priceEur: 1890,
    accent: '#005A9C',
  },
  {
    id: 'haier-jade',
    brand: 'Haier',
    series: 'Jade',
    model: 'Wandmodel',
    tag: 'Premium Luchtreiniger',
    description:
      'Combineert een hoogwaardige A+++ airconditioning met een professionele IFD-luchtreiniger. Ideaal als u naast comfort ook schonere lucht in huis wilt.',
    features: [
      'Energielabel A+++ / A+++',
      'Geïntegreerd IFD-luchtfilter',
      'Superstil (slechts 15 dB(A))',
      'Zuivert de lucht van allergenen',
    ],
    coolingKwMin: 2.6,
    coolingKwMax: 5.2,
    heatingKw: 6.0,
    seer: 8.75,
    scop: 5.1,
    energyClassCooling: 'A+++',
    energyClassHeating: 'A+++',
    noiseSilentDba: 15,
    minTempC: -20,
    refrigerant: 'R32',
    roomM2: 'tot 40 m²',
    heatingCoverage: 0.62,
    priceEur: 3290,
    accent: '#005A9C',
  },
  {
    id: 'haier-expert',
    brand: 'Haier',
    series: 'Expert',
    model: 'Wandmodel',
    tag: 'Topklasse & Hygiëne',
    description:
      'Ontworpen voor maximale hygiëne en eenvoudig onderhoud met ingebouwde UV-C Pro technologie. Topklasse comfort met Coanda Airflow en een hoog energielabel.',
    features: [
      'UV-C Pro luchtreiniging',
      'Extreem makkelijk te reinigen',
      'Coanda Airflow technologie',
      'Energielabel A+++ / A++',
    ],
    coolingKwMin: 2.8,
    coolingKwMax: 6.2,
    heatingKw: 6.8,
    seer: 8.5,
    scop: 4.6,
    energyClassCooling: 'A+++',
    energyClassHeating: 'A++',
    noiseSilentDba: 16,
    minTempC: -20,
    refrigerant: 'R32',
    roomM2: 'tot 40 m²',
    heatingCoverage: 0.58,
    priceEur: 2890,
    accent: '#005A9C',
  },
  {
    id: 'mitsubishi-ln',
    brand: 'Mitsubishi Electric',
    series: 'Kirigamine Style',
    model: 'MSZ-LN',
    tag: 'Stil en betrouwbaar',
    description:
      'Wandmodel MSZ-LN. Energielabel A+++ voor koelen en verwarmen, fluisterstil tot 19 dB(A). Een stijlvol Mitsubishi-design voor wie stilte en betrouwbaarheid belangrijk vindt.',
    features: [
      'Energielabel A+++ / A+++',
      'Slechts 19 dB(A) fluisterstil',
      'Koelen en verwarmen',
      'Design wandmodel',
    ],
    coolingKwMin: 2.5,
    coolingKwMax: 6.1,
    heatingKw: 6.8,
    seer: 9.5,
    scop: 5.1,
    energyClassCooling: 'A+++',
    energyClassHeating: 'A+++',
    noiseSilentDba: 19,
    minTempC: -15,
    refrigerant: 'R32',
    roomM2: 'tot 40 m²',
    heatingCoverage: 0.58,
    priceEur: 3190,
    accent: '#1d4ed8',
  },
]
