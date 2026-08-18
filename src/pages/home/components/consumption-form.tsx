type ConsumptionFormProps = {
  monthlyGas: number
  monthlyElec: number
  onGasChange: (value: number) => void
  onElecChange: (value: number) => void
}

function Field({
  label,
  unit,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  unit: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-baseline justify-between text-sm text-ink/70">
        <span>{label}</span>
        <span className="font-medium text-teal">
          {value} {unit}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-mist accent-teal"
      />
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-3 w-full rounded-xl border border-mist bg-foam px-3 py-2 text-ink outline-none focus:border-teal"
      />
    </label>
  )
}

export default function ConsumptionForm({
  monthlyGas,
  monthlyElec,
  onGasChange,
  onElecChange,
}: ConsumptionFormProps) {
  return (
    <section id="verbruik" className="mx-auto max-w-6xl scroll-mt-4 px-4 py-12 sm:px-6 sm:py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-medium tracking-[0.2em] text-teal uppercase">
          Stap 3
        </p>
        <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
          Bereken je besparing
        </h2>
        <p className="mt-3 text-ink/70">
          Vul je gemiddelde maandverbruik in. We rekenen daarna uit wat dit
          model je per jaar scheelt.
        </p>
      </div>

      <form
        className="mt-8 rounded-3xl border border-mist bg-white p-5 shadow-sm sm:p-6"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label="Gas per maand"
            unit="m³"
            value={monthlyGas}
            min={0}
            max={400}
            step={5}
            onChange={onGasChange}
          />
          <Field
            label="Stroom per maand"
            unit="kWh"
            value={monthlyElec}
            min={0}
            max={800}
            step={10}
            onChange={onElecChange}
          />
        </div>
      </form>
    </section>
  )
}
