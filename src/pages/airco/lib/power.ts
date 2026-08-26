import type { Airco } from '../data/aircos'

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

export function maxCoolingKw(airco: Airco): number {
  return airco.coolingKwMax
}

/** Besparing en overzicht rekenen altijd met het maximale koelvermogen. */
export function applyCapacity(airco: Airco, _requiredKw: number | null): Airco {
  return airco
}
