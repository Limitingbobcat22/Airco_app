import { useMemo, useLayoutEffect, useState } from 'react'
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
import { calculateSavings } from './lib/savings'

export default function HomePage() {
  const [areaM2, setAreaM2] = useState<number | null>(null)
  const [heightM, setHeightM] = useState(2.5)
  const [insulationFactor, setInsulationFactor] =
    useState<InsulationFactor>(40)
  const [monthlyGas, setMonthlyGas] = useState(0)
  const [monthlyElec, setMonthlyElec] = useState(0)
  const [hasAdjustedConsumption, setHasAdjustedConsumption] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useLayoutEffect(() => {
    document.getElementById('page-scroll')?.scrollTo({ top: 0 })
  }, [])

  const power = useMemo(
    () => calculateRequiredPower({ areaM2, heightM, insulationFactor }),
    [areaM2, heightM, insulationFactor],
  )

  const handleGasChange = (value: number) => {
    setMonthlyGas(value)
    setHasAdjustedConsumption(true)
  }

  const handleElecChange = (value: number) => {
    setMonthlyElec(value)
    setHasAdjustedConsumption(true)
  }

  const selected = AIRCOS.find((airco) => airco.id === selectedId) ?? null
  const sized = selected
    ? applyCapacity(selected, power?.requiredKw ?? null)
    : null
  const savings = sized
    ? calculateSavings(monthlyGas, monthlyElec, sized)
    : null

  return (
    <div id="top" className="flex h-full min-h-0 flex-col bg-foam">
      <div id="page-scroll" className="min-h-0 flex-1 overflow-y-auto">
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
          monthlyGas={monthlyGas}
          monthlyElec={monthlyElec}
          onGasChange={handleGasChange}
          onElecChange={handleElecChange}
        />
        <SavingsPanel
          airco={sized}
          savings={savings}
          requiredKw={power?.requiredKw ?? null}
          areaM2={areaM2}
          heightM={heightM}
          insulationFactor={insulationFactor}
        />
      </div>
      <SavingsDock
        airco={sized}
        savings={savings}
        visible={hasAdjustedConsumption}
      />
    </div>
  )
}
