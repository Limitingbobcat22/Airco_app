import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, Eye } from 'lucide-react'
import SiteFooter from '@/components/shared/site-footer'
import { Modal } from '@/components/ui/modal'
import {
  handleidingFileUrl,
  listHandleidingen,
  type Handleiding,
} from '@/lib/api/handleidingen'

export default function HandleidingenPage() {
  const [preview, setPreview] = useState<Handleiding | null>(null)
  const {
    data: handleidingen = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['handleidingen'],
    queryFn: listHandleidingen,
  })

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div id="page-scroll" className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex min-h-full flex-col">
          <div className="hero-bg relative flex-1 overflow-hidden px-4 py-10 sm:px-6 sm:py-14">
            <div className="relative mx-auto max-w-6xl">
              <div className="max-w-3xl">
                <p className="text-xs font-medium tracking-[0.2em] text-teal uppercase">
                  Documentatie
                </p>
                <h1 className="mt-2 font-display text-3xl text-ink sm:text-5xl">
                  Handleidingen
                </h1>
                <p className="mt-3 text-base text-ink/70 sm:text-lg">
                  Bekijk de PDF-handleidingen bij onze producten. Klik op een
                  handleiding om een voorbeeld te openen.
                </p>
              </div>

              <div className="mt-10">
                {isLoading ? (
                  <p className="text-sm text-ink/60">Handleidingen laden…</p>
                ) : isError ? (
                  <p className="text-sm text-destructive">
                    {error instanceof Error
                      ? error.message
                      : 'Kon handleidingen niet ophalen.'}
                  </p>
                ) : handleidingen.length === 0 ? (
                  <p className="text-sm text-ink/60">
                    Er zijn nog geen handleidingen beschikbaar.
                  </p>
                ) : (
                  <ul className="grid gap-4">
                    {handleidingen.map((handleiding) => (
                      <li key={handleiding.id}>
                        <button
                          type="button"
                          onClick={() => setPreview(handleiding)}
                          className="flex w-full items-center gap-4 rounded-2xl border border-mist bg-white/80 p-5 text-left shadow-sm transition hover:border-teal/40 hover:bg-white focus-visible:ring-2 focus-visible:ring-teal focus-visible:outline-none sm:gap-5 sm:p-6"
                        >
                          <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-foam text-teal sm:size-14">
                            <BookOpen className="size-6 sm:size-7" aria-hidden />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-display text-xl text-ink sm:text-2xl">
                              {handleiding.title}
                            </span>
                            {handleiding.description ? (
                              <span className="mt-1 block text-sm text-ink/65 sm:text-base">
                                {handleiding.description}
                              </span>
                            ) : null}
                          </span>
                          <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-teal">
                            <Eye className="size-4" aria-hidden />
                            Bekijken
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <SiteFooter />
        </div>
      </div>

      <Modal
        title={preview?.title ?? 'Handleiding'}
        description="PDF-voorbeeld"
        isOpen={preview != null}
        onClose={() => setPreview(null)}
        className="w-[min(96vw,56rem)] max-w-[56rem] overflow-hidden p-3 sm:p-4"
      >
        <div className="space-y-3">
          <div>
            <h2 className="font-display text-2xl text-ink">
              {preview?.title ?? 'Handleiding'}
            </h2>
            {preview?.description ? (
              <p className="mt-1 text-sm text-ink/70">{preview.description}</p>
            ) : null}
          </div>
          {preview ? (
            <iframe
              title={preview.title}
              src={handleidingFileUrl(preview)}
              className="h-[70dvh] w-full rounded-xl border border-mist bg-white"
            />
          ) : null}
        </div>
      </Modal>
    </div>
  )
}
