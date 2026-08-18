import type { Airco } from '../data/aircos'

export const ENERGY = {
  gasKwhPerM3: 9.77,
  boilerEfficiency: 0.9,
  gasPriceEur: 1.4,
  elecPriceEur: 0.28,
  co2GasKgPerM3: 1.78,
  co2ElecKgPerKwh: 0.244,
  spaceHeatingShare: 0.7,
  oldCoolingSeer: 3.2,
  coolingShareOfElec: 0.08,
} as const

export type PeriodSavings = {
  gasM3Saved: number
  heatingElecKwh: number
  coolingElecSavedKwh: number
  extraElecKwh: number
  gasEuroSaved: number
  elecEuroDelta: number
  netEuroSaved: number
  co2SavedKg: number
}

export type SavingsResult = {
  monthly: PeriodSavings
  yearly: PeriodSavings
  paybackYears: number | null
}

function scale(period: PeriodSavings, factor: number): PeriodSavings {
  return {
    gasM3Saved: period.gasM3Saved * factor,
    heatingElecKwh: period.heatingElecKwh * factor,
    coolingElecSavedKwh: period.coolingElecSavedKwh * factor,
    extraElecKwh: period.extraElecKwh * factor,
    gasEuroSaved: period.gasEuroSaved * factor,
    elecEuroDelta: period.elecEuroDelta * factor,
    netEuroSaved: period.netEuroSaved * factor,
    co2SavedKg: period.co2SavedKg * factor,
  }
}

export function calculateSavings(
  monthlyGasM3: number,
  monthlyElecKwh: number,
  airco: Airco,
): SavingsResult {
  const gas = Math.max(0, monthlyGasM3)
  const elec = Math.max(0, monthlyElecKwh)

  const replaceableGas = gas * ENERGY.spaceHeatingShare * airco.heatingCoverage
  const usefulHeatKwh = replaceableGas * ENERGY.gasKwhPerM3 * ENERGY.boilerEfficiency
  const heatingElecKwh = airco.scop > 0 ? usefulHeatKwh / airco.scop : 0

  const oldCoolingKwh = elec * ENERGY.coolingShareOfElec
  const newCoolingKwh =
    airco.seer > 0 ? oldCoolingKwh * (ENERGY.oldCoolingSeer / airco.seer) : oldCoolingKwh
  const coolingElecSavedKwh = Math.max(0, oldCoolingKwh - newCoolingKwh)
  const extraElecKwh = heatingElecKwh - coolingElecSavedKwh

  const gasEuroSaved = replaceableGas * ENERGY.gasPriceEur
  const elecEuroDelta = extraElecKwh * ENERGY.elecPriceEur
  const netEuroSaved = gasEuroSaved - elecEuroDelta
  const co2SavedKg =
    replaceableGas * ENERGY.co2GasKgPerM3 - extraElecKwh * ENERGY.co2ElecKgPerKwh

  const monthly: PeriodSavings = {
    gasM3Saved: replaceableGas,
    heatingElecKwh,
    coolingElecSavedKwh,
    extraElecKwh,
    gasEuroSaved,
    elecEuroDelta,
    netEuroSaved,
    co2SavedKg,
  }

  const yearly = scale(monthly, 12)
  const paybackYears =
    yearly.netEuroSaved > 0 ? airco.priceEur / yearly.netEuroSaved : null

  return { monthly, yearly, paybackYears }
}

export const eur = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

export const eurExact = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 2,
})

export const num = new Intl.NumberFormat('nl-NL', {
  maximumFractionDigits: 0,
})

export const dec = new Intl.NumberFormat('nl-NL', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})
