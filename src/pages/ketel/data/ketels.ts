export type Ketel = {
  id: string
  brand: string
  series: string
  tag: string
  description: string
  powerKw: number
  efficiencyPct: number
  fuel: 'Gas' | 'Hybride'
  priceEur: number
  features: string[]
}

export const KETELS: Ketel[] = [
  {
    id: 'intergas-xonon',
    brand: 'Intergas',
    series: 'Xonon Compact',
    tag: 'Populair',
    description:
      'Compacte HR-ketel voor gemiddelde woningen. Betrouwbaar, stil en eenvoudig te onderhouden.',
    powerKw: 24,
    efficiencyPct: 107,
    fuel: 'Gas',
    priceEur: 1890,
    features: ['HR-rendement', 'Modulair vermogen', 'Stille werking'],
  },
  {
    id: 'remera-tzerra',
    brand: 'Remeha',
    series: 'Tzerra Ace',
    tag: 'Voordelig',
    description:
      'Instapketel met solide prestaties. Geschikt voor kleinere huishoudens met beperkte warmtevraag.',
    powerKw: 18,
    efficiencyPct: 104,
    fuel: 'Gas',
    priceEur: 1590,
    features: ['Compact design', 'Eenvoudige bediening', 'Lage onderhoudskosten'],
  },
  {
    id: 'nerfit-hybride',
    brand: 'Nefit',
    series: 'Trendline Hybride',
    tag: 'Toekomstgericht',
    description:
      'Hybride opstelling die samenwerkt met een warmtepomp. Minder gas, meer comfort op koude dagen.',
    powerKw: 28,
    efficiencyPct: 110,
    fuel: 'Hybride',
    priceEur: 3290,
    features: ['Hybride-ready', 'Hoge efficiëntie', 'Slimme sturing'],
  },
]
