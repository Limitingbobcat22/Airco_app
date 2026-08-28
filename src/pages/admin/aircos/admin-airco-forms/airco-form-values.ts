import type { CreateAircoInput } from '@/lib/api/aircos'
import type { Airco } from '@/pages/airco/data/aircos'

export const ENERGY_CLASSES = [
  'A+++',
  'A++',
  'A+',
  'A',
  'B',
  'C',
  'D',
] as const

export type AircoFormValues = {
  brand: string
  model: string
  unitType: string
  tag: string
  description: string
  productFunction: string
  trustPoints: string[]
  coolingKw: number | ''
  heatingKw: number | ''
  seer: number | ''
  scop: number | ''
  energyClassCooling: string
  energyClassHeating: string
  noiseDbaInside: number | ''
  noiseDbaOutside: number | ''
  netSizeInside: string
  netSizeOutside: string
  refrigerant: string
  roomM2: string
  heatingCoverage: number | ''
  priceEur: number | ''
  accent: string
}

export const EMPTY_AIRCO_FORM: AircoFormValues = {
  brand: '',
  model: '',
  unitType: '',
  tag: '',
  description: '',
  productFunction: '',
  trustPoints: ['', ''],
  coolingKw: '',
  heatingKw: '',
  seer: '',
  scop: '',
  energyClassCooling: '',
  energyClassHeating: '',
  noiseDbaInside: '',
  noiseDbaOutside: '',
  netSizeInside: '',
  netSizeOutside: '',
  refrigerant: '',
  roomM2: '',
  heatingCoverage: '',
  priceEur: '',
  accent: '#005A9C',
}

export function parseNumberInput(raw: string): number | '' {
  if (raw === '') return ''
  const next = Number(raw)
  return Number.isFinite(next) ? next : ''
}

export function aircoToFormValues(airco: Airco): AircoFormValues {
  return {
    brand: airco.brand,
    model: airco.model,
    unitType: airco.unitType,
    tag: airco.tag,
    description: airco.description,
    productFunction: airco.productFunction,
    trustPoints: airco.trustPoints.length ? [...airco.trustPoints] : ['', ''],
    coolingKw: airco.coolingKw,
    heatingKw: airco.heatingKw,
    seer: airco.seer,
    scop: airco.scop,
    energyClassCooling: airco.energyClassCooling,
    energyClassHeating: airco.energyClassHeating,
    noiseDbaInside: airco.noiseDbaInside,
    noiseDbaOutside: airco.noiseDbaOutside,
    netSizeInside: airco.netSizeInside,
    netSizeOutside: airco.netSizeOutside,
    refrigerant: airco.refrigerant,
    roomM2: airco.roomM2,
    heatingCoverage: airco.heatingCoverage,
    priceEur: airco.priceEur,
    accent: airco.accent,
  }
}

export function toCreatePayload(values: AircoFormValues): CreateAircoInput {
  const trustPoints = values.trustPoints.map((point) => point.trim()).filter(Boolean)

  return {
    brand: values.brand.trim(),
    model: values.model.trim(),
    description: values.description.trim(),
    coolingKw: Number(values.coolingKw),
    heatingKw: Number(values.heatingKw),
    seer: Number(values.seer),
    scop: Number(values.scop),
    energyClassCooling: values.energyClassCooling,
    energyClassHeating: values.energyClassHeating,
    noiseDbaInside: Number(values.noiseDbaInside),
    noiseDbaOutside: Number(values.noiseDbaOutside),
    roomM2: values.roomM2.trim(),
    priceEur: Number(values.priceEur),
    ...(values.unitType.trim() ? { unitType: values.unitType.trim() } : {}),
    ...(values.tag.trim() ? { tag: values.tag.trim() } : {}),
    ...(values.productFunction.trim()
      ? { productFunction: values.productFunction.trim() }
      : {}),
    ...(trustPoints.length ? { trustPoints } : {}),
    ...(values.netSizeInside.trim()
      ? { netSizeInside: values.netSizeInside.trim() }
      : {}),
    ...(values.netSizeOutside.trim()
      ? { netSizeOutside: values.netSizeOutside.trim() }
      : {}),
    ...(values.refrigerant.trim() ? { refrigerant: values.refrigerant.trim() } : {}),
    ...(values.heatingCoverage !== ''
      ? { heatingCoverage: Number(values.heatingCoverage) }
      : {}),
    ...(values.accent.trim() ? { accent: values.accent.trim() } : {}),
  }
}
