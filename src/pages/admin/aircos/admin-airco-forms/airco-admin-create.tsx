import { useEffect, useState } from 'react'
import { Check, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  AIRCO_PHOTO_SLOTS,
  pendingImagesFromFiles,
  type PendingAircoImage,
} from '@/pages/airco/data/airco-photos'
import {
  FieldError,
  IdentityField,
  SpecField,
  identityClass,
  selectClass,
  specClass,
  withFieldError,
} from './airco-admin-form-ui'
import AircoPhotoSlider from '../components/airco-photo-slider'
import {
  ENERGY_CLASSES,
  parseNumberInput,
  type AircoFormValues,
} from './airco-form-values'
import { useAircoForm } from './use-airco-form'

type AircoAdminCreateProps = {
  initialValues: AircoFormValues
  submitting?: boolean
  error?: string | null
  onSubmit: (values: AircoFormValues, images: PendingAircoImage[]) => void
  onDirtyChange?: (dirty: boolean) => void
  onCancel: () => void
}

export default function AircoAdminCreate({
  initialValues,
  submitting = false,
  error,
  onSubmit,
  onDirtyChange,
  onCancel,
}: AircoAdminCreateProps) {
  const [photoFiles, setPhotoFiles] = useState<(File | null)[]>(() =>
    AIRCO_PHOTO_SLOTS.map(() => null),
  )
  const {
    values,
    fieldErrors,
    isDirty,
    update,
    updateTrustPoint,
    addTrustPoint,
    removeTrustPoint,
    handleSubmit,
    headingBrand,
    headingModel,
  } = useAircoForm(initialValues, (nextValues) =>
    onSubmit(nextValues, pendingImagesFromFiles(photoFiles)),
  )

  useEffect(() => {
    const dirty = isDirty || photoFiles.some(Boolean)
    onDirtyChange?.(dirty)
    return () => onDirtyChange?.(false)
  }, [isDirty, photoFiles, onDirtyChange])

  return (
    <form className="space-y-6 pb-2" noValidate onSubmit={handleSubmit}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start lg:gap-10">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium tracking-[0.1em] text-ink/45 uppercase">
              Airco · {values.brand.trim() || 'nieuw'}
            </p>
            <h3 className="mt-1 font-display text-2xl text-ink sm:text-3xl">
              {headingBrand} {headingModel}
            </h3>
            <p className="mt-1 text-sm text-ink/60">
              {values.tag.trim() || 'Tag, bijvoorbeeld Voordelig & Efficient'}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <IdentityField
              id="airco-brand"
              label="Merk"
              value={values.brand}
              error={fieldErrors.brand}
              placeholder="Haier"
              onChange={(value) => update('brand', value)}
            />
            <IdentityField
              id="airco-model"
              label="Model"
              value={values.model}
              error={fieldErrors.model}
              placeholder="Model/Series"
              onChange={(value) => update('model', value)}
            />
            <IdentityField
              id="airco-tag"
              label="Tag"
              value={values.tag}
              error={fieldErrors.tag}
              placeholder="Voordelig & Efficient"
              className="sm:col-span-2"
              onChange={(value) => update('tag', value)}
            />
          </div>

          <AircoPhotoSlider
            accent={values.accent || '#005A9C'}
            brand={values.brand}
            model={values.model}
            files={photoFiles}
            onChange={setPhotoFiles}
          />
        </div>

        <div className="space-y-6 lg:sticky lg:top-0">
          <div>
            <p className="font-display text-2xl text-ink sm:text-3xl">
              {headingBrand} {headingModel} airco
            </p>
            <FieldError error={fieldErrors.priceEur} />
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <label htmlFor="airco-price" className="sr-only">
                Prijs
              </label>
              <span className="text-base font-semibold text-teal">Vanaf</span>
              <input
                id="airco-price"
                type="number"
                min={0}
                step={0.01}
                value={values.priceEur}
                onChange={(e) =>
                  update('priceEur', parseNumberInput(e.target.value))
                }
                className={withFieldError(
                  'w-28 rounded-lg border border-mist bg-white px-2.5 py-1 text-left text-base font-semibold text-teal outline-none placeholder:text-teal/40 focus:border-teal',
                  fieldErrors.priceEur,
                )}
                placeholder="1890"
              />
              <span className="text-base font-semibold text-teal">
                incl. standaard montage
              </span>
            </div>
            <div className="mt-3 space-y-1.5">
            <label htmlFor="airco-description" className="sr-only">
              Beschrijving
            </label>
            <FieldError error={fieldErrors.description} />
            <textarea
              id="airco-description"
              rows={3}
              value={values.description}
              onChange={(e) => update('description', e.target.value)}
              className={withFieldError(
                'w-full rounded-xl border border-mist bg-foam px-3 py-2.5 text-sm leading-relaxed text-ink/80 outline-none placeholder:text-ink/35 focus:border-teal',
                fieldErrors.description,
              )}
              placeholder="Korte productbeschrijving"
            />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-mist">
            <SpecField label="Type" htmlFor="airco-unit-type">
              <input
                id="airco-unit-type"
                value={values.unitType}
                onChange={(e) => update('unitType', e.target.value)}
                className={specClass}
                placeholder="Wandmodel (split)"
              />
            </SpecField>
            <SpecField
              label="Functie"
              htmlFor="airco-function"
              striped
            >
              <input
                id="airco-function"
                value={values.productFunction}
                onChange={(e) => update('productFunction', e.target.value)}
                className={specClass}
                placeholder="Koelen en verwarmen"
              />
            </SpecField>
            <SpecField
              label="Koel vermogen"
              htmlFor="airco-cooling"
              error={fieldErrors.coolingKw}
            >
              <div className="flex items-center justify-end gap-1.5">
                <input
                  id="airco-cooling"
                  type="number"
                  min={0}
                  step={0.1}
                  value={values.coolingKw}
                  onChange={(e) =>
                    update('coolingKw', parseNumberInput(e.target.value))
                  }
                  className={withFieldError(specClass, fieldErrors.coolingKw)}
                  placeholder="6.2"
                />
                <span className="shrink-0 text-ink/45">kW</span>
              </div>
            </SpecField>
            <SpecField
              label="Verwarm vermogen"
              htmlFor="airco-heating"
              striped
              error={fieldErrors.heatingKw}
            >
              <div className="flex items-center justify-end gap-1.5">
                <input
                  id="airco-heating"
                  type="number"
                  min={0}
                  step={0.1}
                  value={values.heatingKw}
                  onChange={(e) =>
                    update('heatingKw', parseNumberInput(e.target.value))
                  }
                  className={withFieldError(specClass, fieldErrors.heatingKw)}
                  placeholder="6.3"
                />
                <span className="shrink-0 text-ink/45">kW</span>
              </div>
            </SpecField>
            <SpecField
              label="Energielabel"
              error={
                [fieldErrors.energyClassCooling, fieldErrors.energyClassHeating]
                  .filter(Boolean)
                  .join(' ')
              }
            >
              <div className="flex items-center justify-end gap-2">
                <select
                  id="airco-label-cooling"
                  value={values.energyClassCooling}
                  onChange={(e) => update('energyClassCooling', e.target.value)}
                  className={withFieldError(
                    selectClass,
                    fieldErrors.energyClassCooling,
                  )}
                  aria-label="Energielabel koelen"
                >
                  <option value="">Koelen</option>
                  {ENERGY_CLASSES.map((item) => (
                    <option key={`c-${item}`} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <span className="text-ink/35">/</span>
                <select
                  id="airco-label-heating"
                  value={values.energyClassHeating}
                  onChange={(e) => update('energyClassHeating', e.target.value)}
                  className={withFieldError(
                    selectClass,
                    fieldErrors.energyClassHeating,
                  )}
                  aria-label="Energielabel verwarmen"
                >
                  <option value="">Verwarmen</option>
                  {ENERGY_CLASSES.map((item) => (
                    <option key={`h-${item}`} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </SpecField>
            <SpecField
              label="SEER"
              htmlFor="airco-seer"
              striped
              error={fieldErrors.seer}
            >
              <input
                id="airco-seer"
                type="number"
                min={0}
                step={0.01}
                value={values.seer}
                onChange={(e) =>
                  update('seer', parseNumberInput(e.target.value))
                }
                className={withFieldError(specClass, fieldErrors.seer)}
                placeholder="6.10"
              />
            </SpecField>
            <SpecField
              label="SCOP"
              htmlFor="airco-scop"
              error={fieldErrors.scop}
            >
              <input
                id="airco-scop"
                type="number"
                min={0}
                step={0.01}
                value={values.scop}
                onChange={(e) =>
                  update('scop', parseNumberInput(e.target.value))
                }
                className={withFieldError(specClass, fieldErrors.scop)}
                placeholder="4.00"
              />
            </SpecField>
            <SpecField
              label="Geluid binnenunit"
              htmlFor="airco-noise-inside"
              striped
              error={fieldErrors.noiseDbaInside}
            >
              <div className="flex items-center justify-end gap-1.5">
                <input
                  id="airco-noise-inside"
                  type="number"
                  min={0}
                  step={1}
                  value={values.noiseDbaInside}
                  onChange={(e) =>
                    update('noiseDbaInside', parseNumberInput(e.target.value))
                  }
                  className={withFieldError(
                    specClass,
                    fieldErrors.noiseDbaInside,
                  )}
                  placeholder="19"
                />
                <span className="shrink-0 text-ink/45">dB(A)</span>
              </div>
            </SpecField>
            <SpecField
              label="Geluid buitenunit"
              htmlFor="airco-noise-outside"
              error={fieldErrors.noiseDbaOutside}
            >
              <div className="flex items-center justify-end gap-1.5">
                <input
                  id="airco-noise-outside"
                  type="number"
                  min={0}
                  step={1}
                  value={values.noiseDbaOutside}
                  onChange={(e) =>
                    update('noiseDbaOutside', parseNumberInput(e.target.value))
                  }
                  className={withFieldError(
                    specClass,
                    fieldErrors.noiseDbaOutside,
                  )}
                  placeholder="48"
                />
                <span className="shrink-0 text-ink/45">dB(A)</span>
              </div>
            </SpecField>
            <SpecField
              label="Netto afmeting binnenunit"
              htmlFor="airco-size-inside"
              striped
            >
              <input
                id="airco-size-inside"
                value={values.netSizeInside}
                onChange={(e) => update('netSizeInside', e.target.value)}
                className={specClass}
                placeholder="295 × 858 × 187 mm"
              />
            </SpecField>
            <SpecField
              label="Netto afmeting buitenunit"
              htmlFor="airco-size-outside"
            >
              <input
                id="airco-size-outside"
                value={values.netSizeOutside}
                onChange={(e) => update('netSizeOutside', e.target.value)}
                className={specClass}
                placeholder="700 × 870 × 320 mm"
              />
            </SpecField>
            <SpecField
              label="Koudemiddel"
              htmlFor="airco-refrigerant"
              striped
            >
              <input
                id="airco-refrigerant"
                value={values.refrigerant}
                onChange={(e) => update('refrigerant', e.target.value)}
                className={specClass}
                placeholder="R32"
              />
            </SpecField>
            <SpecField
              label="Geschikte ruimte"
              htmlFor="airco-room"
              error={fieldErrors.roomM2}
            >
              <input
                id="airco-room"
                value={values.roomM2}
                onChange={(e) => update('roomM2', e.target.value)}
                className={withFieldError(specClass, fieldErrors.roomM2)}
                placeholder="tot 40 m²"
              />
            </SpecField>
            <SpecField
              label="Dekking verwarming"
              htmlFor="airco-coverage"
              striped
              error={fieldErrors.heatingCoverage}
            >
              <input
                id="airco-coverage"
                type="number"
                min={0}
                max={1}
                step={0.01}
                value={values.heatingCoverage}
                onChange={(e) =>
                  update('heatingCoverage', parseNumberInput(e.target.value))
                }
                className={withFieldError(
                  specClass,
                  fieldErrors.heatingCoverage,
                )}
                placeholder="0.55"
              />
            </SpecField>
            <SpecField
              label="Accentkleur"
              htmlFor="airco-accent"
              error={fieldErrors.accent}
            >
              <div className="flex items-center justify-end gap-2">
                <input
                  id="airco-accent"
                  type="color"
                  value={values.accent || '#005A9C'}
                  onChange={(e) => update('accent', e.target.value)}
                  className="size-8 cursor-pointer rounded border border-mist bg-white"
                />
                <input
                  value={values.accent}
                  onChange={(e) => update('accent', e.target.value)}
                  className={withFieldError(specClass, fieldErrors.accent)}
                  placeholder="#005A9C"
                />
              </div>
            </SpecField>
          </div>

          <div className="space-y-2 border-t border-mist pt-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-ink">Vertrouwenspunten</p>
              <button
                type="button"
                onClick={addTrustPoint}
                className="inline-flex items-center gap-1 rounded-full border border-mist bg-white px-2.5 py-1 text-xs font-medium text-ink/70 hover:border-teal/40 hover:text-teal"
              >
                <Plus className="size-3.5" />
                Regel
              </button>
            </div>
            <ul className="space-y-2">
              {values.trustPoints.map((point, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check
                    className="size-4 shrink-0 text-teal"
                    strokeWidth={3}
                    aria-hidden
                  />
                  <input
                    value={point}
                    onChange={(e) => updateTrustPoint(index, e.target.value)}
                    className={cn(identityClass, 'bg-white py-2')}
                    placeholder={
                      index === 0
                        ? 'Inclusief standaard montage'
                        : 'F-gassen-gecertificeerde monteur'
                    }
                  />
                  <button
                    type="button"
                    onClick={() => removeTrustPoint(index)}
                    className="grid size-8 shrink-0 place-items-center rounded-lg text-ink/35 hover:bg-foam hover:text-destructive"
                    aria-label="Regel verwijderen"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {error ? (
            <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-3 border-t border-mist pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="rounded-xl border border-mist bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-foam disabled:opacity-60"
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-mint px-5 py-2.5 text-sm font-semibold text-ink hover:bg-white disabled:opacity-60"
            >
              {submitting ? 'Opslaan…' : 'Toevoegen'}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
