import type { Airco, AircoCapacity } from '../data/aircos'

export const INSULATION_OPTIONS = [
  {
    factor: 30,
    shortLabel: 'Goed geïsoleerd',
    label: 'Goed geïsoleerd (Nieuwbouw, goed geïsoleerd dak/muren, HR++ glas)',
  },
  {
    factor: 40,
    shortLabel: 'Gemiddeld geïsoleerd',
    label: 'Gemiddeld geïsoleerd (Tussenwoning, dubbel glas)',
  },
  {
    factor: 50,
    shortLabel: 'Slecht geïsoleerd',
    label: 'Slecht geïsoleerd (Oude woning, enkel glas, plat dak)',
  },
] as const

export type InsulationFactor = (typeof INSULATION_OPTIONS)[number]['factor']

export const POWER_DEFAULTS = {
  heightM: 2.5,
  insulationFactor: 40 as InsulationFactor,
  heatingSharePct: 70,
}

export type PowerInput = {
  areaM2: number | null
  heightM: number
  insulationFactor: InsulationFactor
  heatingSharePct: number
}

export type PowerResult = {
  requiredKw: number
}

export function calculateRequiredPower({
  areaM2,
  heightM,
  insulationFactor,
  heatingSharePct,
}: PowerInput): PowerResult | null {
  if (!areaM2 || areaM2 <= 0 || heightM <= 0) return null

  const share = Math.min(100, Math.max(0, heatingSharePct)) / 100

  return {
    requiredKw: (areaM2 * heightM * insulationFactor * share) / 1000,
  }
}

export function insulationLabel(factor: InsulationFactor, short = false): string {
  const option = INSULATION_OPTIONS.find((item) => item.factor === factor)
  if (!option) return ''
  return short ? option.shortLabel : option.label
}

export function pickCapacity(
  airco: Airco,
  requiredKw: number | null,
): AircoCapacity {
  const capacities = airco.availableCapacities
  const fallback = capacities.find((item) => item.code === '35') ?? capacities[0]

  if (requiredKw == null) return fallback

  const covering = capacities.filter((item) => item.coolingKw >= requiredKw)
  if (covering.length > 0) {
    return covering.reduce((best, item) =>
      item.coolingKw < best.coolingKw ? item : best,
    )
  }

  return capacities.reduce((best, item) =>
    item.coolingKw > best.coolingKw ? item : best,
  )
}

export function maxCoolingKw(airco: Airco): number {
  return airco.availableCapacities.reduce(
    (max, item) => (item.coolingKw > max ? item.coolingKw : max),
    0,
  )
}

export function applyCapacity(airco: Airco, requiredKw: number | null): Airco {
  const capacity = pickCapacity(airco, requiredKw)
  const scale = capacity.coolingKw / 3.5

  return {
    ...airco,
    coolingKw: capacity.coolingKw,
    heatingKw: capacity.heatingKw,
    sizeCode: capacity.code,
    heatingCoverage: Math.min(0.9, Math.round(airco.heatingCoverage * scale * 100) / 100),
    roomM2: `tot ${Math.round(capacity.coolingKw * 11)} m²`,
  }
}
