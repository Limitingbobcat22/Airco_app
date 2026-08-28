export type AircoImageMeta = {
  id: string
  sortOrder: number
  label: string
  mimeType: string
  url: string
}

export type Airco = {
  id: string
  slug: string
  brand: string
  series: string
  model: string
  unitType: string
  tag: string
  description: string
  productFunction: string
  trustPoints: string[]
  coolingKw: number
  heatingKw: number
  seer: number
  scop: number
  energyClassCooling: string
  energyClassHeating: string
  noiseSilentDba: number
  refrigerant: string
  roomM2: string
  heatingCoverage: number
  priceEur: number
  accent: string
  images: AircoImageMeta[]
  createdAt?: string
  updatedAt?: string
}
