import { useEffect, useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router'
import AircoGrid from './components/airco-grid'
import ConsumptionForm from './components/consumption-form'
import Hero from './components/hero'
import PowerForm from './components/power-form'
import SavingsDock from './components/savings-dock'
import SavingsPanel from './components/savings-panel'
import { AIRCOS } from './data/aircos'
import {
  applyCapacity,
  calculateRequiredPower,
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
  const [areaM2, setAreaM2] = useState<number | null>(null)
  const [heightM, setHeightM] = useState(2.5)
  const [insulationFactor, setInsulationFactor] =
    useState<InsulationFactor>(40)
  const [yearlyGas, setYearlyGas] = useState(SAVINGS_DEFAULTS.yearlyGasM3)
  const [gasPrice, setGasPrice] = useState(SAVINGS_DEFAULTS.gasPriceEur)
  const [elecPrice, setElecPrice] = useState(SAVINGS_DEFAULTS.elecPriceEur)
  const [heatingSharePct, setHeatingSharePct] = useState(
    SAVINGS_DEFAULTS.heatingSharePct,
  )
  const [hasAdjustedConsumption, setHasAdjustedConsumption] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    const dirty =
      areaM2 != null ||
      selectedId != null ||
      hasAdjustedConsumption ||
      heightM !== 2.5 ||
      insulationFactor !== 40
    setDirty(dirty)
    return () => setDirty(false)
  }, [
    areaM2,
    selectedId,
    hasAdjustedConsumption,
    heightM,
    insulationFactor,
    setDirty,
  ])

  const power = useMemo(
    () => calculateRequiredPower({ areaM2, heightM, insulationFactor }),
    [areaM2, heightM, insulationFactor],
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

  const handleHeatingShareChange = (value: number) => {
    setHeatingSharePct(value)
    markAdjusted()
  }

  const selected = AIRCOS.find((airco) => airco.id === selectedId) ?? null
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
        <Hero>
          <PowerForm
            areaM2={areaM2}
            heightM={heightM}
            insulationFactor={insulationFactor}
            result={power}
            onAreaChange={setAreaM2}
            onHeightChange={setHeightM}
            onInsulationChange={setInsulationFactor}
            onViewAircos={() => setSelectedId(null)}
          />
        </Hero>
        <AircoGrid
          aircos={AIRCOS}
          selectedId={selectedId}
          requiredKw={power?.requiredKw ?? null}
          onSelect={setSelectedId}
        />
        <ConsumptionForm
          yearlyGas={yearlyGas}
          gasPrice={gasPrice}
          elecPrice={elecPrice}
          heatingSharePct={heatingSharePct}
          airco={sized}
          onYearlyGasChange={handleYearlyGasChange}
          onGasPriceChange={handleGasPriceChange}
          onElecPriceChange={handleElecPriceChange}
          onHeatingShareChange={handleHeatingShareChange}
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
