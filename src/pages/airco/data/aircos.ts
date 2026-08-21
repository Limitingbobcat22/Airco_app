export type EnergyClass = 'A+++' | 'A++' | 'A+'

export type AircoCapacity = {
  code: string
  coolingKw: number
  heatingKw: number
}

export type Airco = {
  id: string
  brand: string
  series: string
  model: string
  tag: string
  description: string
  features: string[]
  coolingKw: number
  heatingKw: number
  sizeCode: string
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
  availableCapacities: AircoCapacity[]
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
    coolingKw: 3.6,
    heatingKw: 3.9,
    sizeCode: '35',
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
    availableCapacities: [
      { code: '25', coolingKw: 2.7, heatingKw: 3.1 },
      { code: '35', coolingKw: 3.6, heatingKw: 3.9 },
      { code: '50', coolingKw: 5.3, heatingKw: 5.8 },
      { code: '70', coolingKw: 7.1, heatingKw: 7.4 },
    ],
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
    coolingKw: 3.5,
    heatingKw: 4.2,
    sizeCode: '35',
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
    availableCapacities: [
      { code: '25', coolingKw: 2.6, heatingKw: 3.2 },
      { code: '35', coolingKw: 3.5, heatingKw: 4.2 },
      { code: '42', coolingKw: 4.2, heatingKw: 4.4 },
      { code: '50', coolingKw: 5.2, heatingKw: 6.0 },
      { code: '70', coolingKw: 7.0, heatingKw: 8.0 },
    ],
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
    coolingKw: 3.5,
    heatingKw: 3.9,
    sizeCode: '35',
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
    availableCapacities: [
      { code: '25', coolingKw: 2.7, heatingKw: 2.9 },
      { code: '35', coolingKw: 3.5, heatingKw: 3.9 },
      { code: '50', coolingKw: 4.8, heatingKw: 4.8 },
      { code: '68', coolingKw: 6.2, heatingKw: 6.3 },
    ],
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
    coolingKw: 3.5,
    heatingKw: 4.2,
    sizeCode: '35',
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
    availableCapacities: [
      { code: '25', coolingKw: 2.6, heatingKw: 3.2 },
      { code: '35', coolingKw: 3.5, heatingKw: 4.2 },
      { code: '50', coolingKw: 5.2, heatingKw: 6.0 },
    ],
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
    coolingKw: 3.5,
    heatingKw: 4.2,
    sizeCode: '35',
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
    availableCapacities: [
      { code: '25', coolingKw: 2.8, heatingKw: 3.2 },
      { code: '35', coolingKw: 3.5, heatingKw: 4.2 },
      { code: '50', coolingKw: 5.0, heatingKw: 6.0 },
      { code: '70', coolingKw: 6.2, heatingKw: 6.8 },
    ],
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
    coolingKw: 3.5,
    heatingKw: 4.0,
    sizeCode: '35',
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
    availableCapacities: [
      { code: '25', coolingKw: 2.5, heatingKw: 3.2 },
      { code: '35', coolingKw: 3.5, heatingKw: 4.0 },
      { code: '50', coolingKw: 5.0, heatingKw: 6.0 },
      { code: '60', coolingKw: 6.1, heatingKw: 6.8 },
    ],
  },
]
