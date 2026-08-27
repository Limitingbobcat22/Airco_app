import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Navigate, useParams } from 'react-router'
import { useGoToSection } from '@/hooks/use-go-to-section'
import { listAircos } from '@/lib/api/aircos'
import AircoGrid from './components/airco-grid'
import ConsumptionForm from './components/consumption-form'
import AircoHome from './components/airco-home'
import PowerForm from './components/power-form'
import SavingsDock from './components/savings-dock'
import SavingsPanel from './components/savings-panel'
import {
  applyCapacity,
  calculateRequiredPower,
  POWER_DEFAULTS,
  type InsulationFactor,
} from './lib/power'
import { SAVINGS_DEFAULTS, calculateSavings } from './lib/savings'
import {
  AIRCO_SECTIONS,
  AIRCO_TOPIC,
  defaultSectionForTopic,
  topicSectionPath,
} from '@/lib/topics'
import { useUnsavedChanges } from '@/providers/unsaved-changes'

export default function AircoPage() {
  const { section } = useParams()
  const { setDirty } = useUnsavedChanges()
  const goToSection = useGoToSection()
  const [areaM2, setAreaM2] = useState<number | null>(null)
  const [heightM, setHeightM] = useState(POWER_DEFAULTS.heightM)
  const [insulationFactor, setInsulationFactor] = useState<InsulationFactor>(
    POWER_DEFAULTS.insulationFactor,
  )
  const [heatingSharePct, setHeatingSharePct] = useState(
    POWER_DEFAULTS.heatingSharePct,
  )
  const [yearlyGas, setYearlyGas] = useState(SAVINGS_DEFAULTS.yearlyGasM3)
  const [gasPrice, setGasPrice] = useState(SAVINGS_DEFAULTS.gasPriceEur)
  const [elecPrice, setElecPrice] = useState(SAVINGS_DEFAULTS.elecPriceEur)
  const [hasAdjustedConsumption, setHasAdjustedConsumption] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const {
    data: aircos = [],
    isLoading: aircosLoading,
    isError: aircosError,
    error: aircosFetchError,
  } = useQuery({
    queryKey: ['aircos'],
    queryFn: listAircos,
  })

  useEffect(() => {
    const dirty =
      areaM2 != null ||
      selectedId != null ||
      hasAdjustedConsumption ||
      heightM !== POWER_DEFAULTS.heightM ||
      insulationFactor !== POWER_DEFAULTS.insulationFactor ||
      heatingSharePct !== POWER_DEFAULTS.heatingSharePct
    setDirty(dirty)
    return () => setDirty(false)
  }, [
    areaM2,
    selectedId,
    hasAdjustedConsumption,
    heightM,
    insulationFactor,
    heatingSharePct,
    setDirty,
  ])

  const power = useMemo(
    () =>
      calculateRequiredPower({
        areaM2,
        heightM,
        insulationFactor,
        heatingSharePct,
      }),
    [areaM2, heightM, insulationFactor, heatingSharePct],
  )

  const markAdjusted = () => setHasAdjustedConsumption(true)

  const handleYearlyGasChange = (value: number) => {
    setYearlyGas(value)
    markAdjusted()
  }

  const handleGasPriceChange = (value: number) => {
    setGasPrice(value)
    markAdjusted()
  }

  const handleElecPriceChange = (value: number) => {
    setElecPrice(value)
    markAdjusted()
  }

  const selected = aircos.find((airco) => airco.id === selectedId) ?? null
  const sized = selected
    ? applyCapacity(selected, power?.requiredKw ?? null)
    : null
  const savings = sized
    ? calculateSavings({
        yearlyGasM3: yearlyGas,
        gasPriceEur: gasPrice,
        elecPriceEur: elecPrice,
        heatingSharePct,
        scop: sized.scop,
      })
    : null

  if (
    !section ||
    !AIRCO_SECTIONS.includes(section as (typeof AIRCO_SECTIONS)[number])
  ) {
    return (
      <Navigate
        to={topicSectionPath(AIRCO_TOPIC, defaultSectionForTopic(AIRCO_TOPIC))}
        replace
      />
    )
  }

  return (
    <div id="top" className="flex h-full min-h-0 flex-col bg-foam">
      <div id="page-scroll" className="min-h-0 flex-1 overflow-y-auto pb-[45vh]">
        <AircoHome />
        <PowerForm
          areaM2={areaM2}
          heightM={heightM}
          insulationFactor={insulationFactor}
          heatingSharePct={heatingSharePct}
          result={power}
          onAreaChange={setAreaM2}
          onHeightChange={setHeightM}
          onInsulationChange={setInsulationFactor}
          onHeatingShareChange={setHeatingSharePct}
          onViewAircos={() => {
            setSelectedId(null)
            goToSection('modellen')
          }}
        />
        {aircosLoading ? (
          <section
            id="modellen"
            className="scroll-mt-24 px-4 py-10 text-center text-sm text-slate-600 sm:px-6"
          >
            Modellen laden…
          </section>
        ) : aircosError ? (
          <section
            id="modellen"
            className="scroll-mt-24 px-4 py-10 text-center text-sm text-red-700 sm:px-6"
          >
            {aircosFetchError instanceof Error
              ? aircosFetchError.message
              : 'Kon aircos niet ophalen.'}
          </section>
        ) : (
          <AircoGrid
            aircos={aircos}
            selectedId={selectedId}
            requiredKw={power?.requiredKw ?? null}
            onSelect={setSelectedId}
          />
        )}
        <ConsumptionForm
          yearlyGas={yearlyGas}
          gasPrice={gasPrice}
          elecPrice={elecPrice}
          airco={sized}
          onYearlyGasChange={handleYearlyGasChange}
          onGasPriceChange={handleGasPriceChange}
          onElecPriceChange={handleElecPriceChange}
        />
        <SavingsPanel
          airco={sized}
          savings={savings}
          requiredKw={power?.requiredKw ?? null}
          areaM2={areaM2}
          heightM={heightM}
          insulationFactor={insulationFactor}
          heatingSharePct={heatingSharePct}
          gasPrice={gasPrice}
          elecPrice={elecPrice}
        />
      </div>
      <SavingsDock
        airco={sized}
        savings={savings}
        visible={hasAdjustedConsumption || selectedId != null}
      />
    </div>
  )
}
