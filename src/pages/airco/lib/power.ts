import type { Airco } from '../data/aircos'

/** Vast isolatiegemiddelde in W/m². */
export const INSULATION_FACTOR = 75

export const POWER_DEFAULTS = {
  heightM: 2.5,
  heatingSharePct: 70,
}

export type PowerInput = {
  areaM2: number | null
  heightM: number
  heatingSharePct: number
}

export type PowerResult = {
  requiredKw: number
}

export function calculateRequiredPower({
  areaM2,
  heightM,
  heatingSharePct,
}: PowerInput): PowerResult | null {
  if (!areaM2 || areaM2 <= 0 || heightM <= 0) return null

  const share = Math.min(100, Math.max(0, heatingSharePct)) / 100
  const heightScale = heightM / POWER_DEFAULTS.heightM

  return {
    requiredKw: (areaM2 * INSULATION_FACTOR * heightScale * share) / 1000,
  }
}

export function maxCoolingKw(airco: Airco): number {
  return airco.coolingKw
}

/** Besparing en overzicht rekenen altijd met het koelvermogen. */
export function applyCapacity(airco: Airco, _requiredKw: number | null): Airco {
  return airco
}
