import { useMemo, useState, type FormEvent } from 'react'
import type { AircoFormValues } from './airco-form-values'

export function useAircoForm(
  initialValues: AircoFormValues,
  onSubmit: (values: AircoFormValues) => void,
) {
  const [baseline] = useState(initialValues)
  const [values, setValues] = useState<AircoFormValues>(initialValues)
  const isDirty = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(baseline),
    [values, baseline],
  )

  const update = <K extends keyof AircoFormValues>(
    key: K,
    value: AircoFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const updateTrustPoint = (index: number, value: string) => {
    setValues((prev) => ({
      ...prev,
      trustPoints: prev.trustPoints.map((point, i) =>
        i === index ? value : point,
      ),
    }))
  }

  const addTrustPoint = () => {
    setValues((prev) => ({
      ...prev,
      trustPoints: [...prev.trustPoints, ''],
    }))
  }

  const removeTrustPoint = (index: number) => {
    setValues((prev) => ({
      ...prev,
      trustPoints:
        prev.trustPoints.length > 1
          ? prev.trustPoints.filter((_, i) => i !== index)
          : [''],
    }))
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit({
      ...values,
      brand: values.brand.trim(),
      model: values.model.trim(),
      unitType: values.unitType.trim(),
      tag: values.tag.trim(),
      description: values.description.trim(),
      productFunction: values.productFunction.trim(),
      trustPoints: values.trustPoints.map((point) => point.trim()),
      netSizeInside: values.netSizeInside.trim(),
      netSizeOutside: values.netSizeOutside.trim(),
      refrigerant: values.refrigerant.trim(),
      roomM2: values.roomM2.trim(),
      accent: values.accent.trim() || '#005A9C',
    })
  }

  return {
    values,
    isDirty,
    update,
    updateTrustPoint,
    addTrustPoint,
    removeTrustPoint,
    handleSubmit,
    headingBrand: values.brand.trim() || 'Merk',
    headingModel: values.model.trim() || 'model',
  }
}
