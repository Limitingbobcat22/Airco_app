export const SAVINGS_DEFAULTS: {
  yearlyGasM3: number
  gasPriceEur: number
  elecPriceEur: number
  heatingSharePct: number
} = {
  yearlyGasM3: 1200,
  gasPriceEur: 1.35,
  elecPriceEur: 0.3,
  heatingSharePct: 70,
}

export const SAVINGS_CONSTANTS = {
  gasKwhPerM3: 8.8,
  co2GasKgPerM3: 1.8,
} as const

export type PeriodSavings = {
  gasM3Saved: number
  heatingElecKwh: number
  extraElecKwh: number
  gasEuroSaved: number
  elecEuroDelta: number
  netEuroSaved: number
  co2SavedKg: number
}

export type SavingsResult = {
  yearly: PeriodSavings
  monthly: PeriodSavings
}

export type SavingsInput = {
  yearlyGasM3: number
  gasPriceEur: number
  elecPriceEur: number
  heatingSharePct: number
  scop: number
}

function scale(period: PeriodSavings, factor: number): PeriodSavings {
  return {
    gasM3Saved: period.gasM3Saved * factor,
    heatingElecKwh: period.heatingElecKwh * factor,
    extraElecKwh: period.extraElecKwh * factor,
    gasEuroSaved: period.gasEuroSaved * factor,
    elecEuroDelta: period.elecEuroDelta * factor,
    netEuroSaved: period.netEuroSaved * factor,
    co2SavedKg: period.co2SavedKg * factor,
  }
}

export function calculateSavings({
  yearlyGasM3,
  gasPriceEur,
  elecPriceEur,
  heatingSharePct,
  scop,
}: SavingsInput): SavingsResult {
  const gas = Math.max(0, yearlyGasM3)
  const gasPrice = Math.max(0, gasPriceEur)
  const elecPrice = Math.max(0, elecPriceEur)
  const share = Math.min(100, Math.max(0, heatingSharePct))
  const safeScop = scop > 0 ? scop : 1

  const gasM3Saved = Math.round(gas * (share / 100))
  const gasEuroSaved = Math.round(gasM3Saved * gasPrice)
  const heatingElecKwh = Math.round(
    (gasM3Saved * SAVINGS_CONSTANTS.gasKwhPerM3) / safeScop,
  )
  const elecEuroDelta = Math.round(heatingElecKwh * elecPrice)
  const netEuroSaved = Math.max(0, gasEuroSaved - elecEuroDelta)
  const co2SavedKg = Math.round(gasM3Saved * SAVINGS_CONSTANTS.co2GasKgPerM3)

  const yearly: PeriodSavings = {
    gasM3Saved,
    heatingElecKwh,
    extraElecKwh: heatingElecKwh,
    gasEuroSaved,
    elecEuroDelta,
    netEuroSaved,
    co2SavedKg,
  }

  const monthly = scale(yearly, 1 / 12)

  return { yearly, monthly }
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
