import { memo, useEffect, useRef, useState } from 'react'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

GlobalWorkerOptions.workerSrc = workerUrl

type PreviewStatus = 'loading' | 'ready' | 'error'

type PdfDocumentPreviewProps = {
  url: string
  title: string
}

type PdfPagesProps = PdfDocumentPreviewProps & {
  onStatus: (status: PreviewStatus) => void
}

const PdfPages = memo(function PdfPages({
  url,
  title,
  onStatus,
}: PdfPagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const pagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scroll = scrollRef.current
    const pages = pagesRef.current
    if (!scroll || !pages) return

    let cancelled = false
    let requestId = 0
    let renderedWidth = -1
    let timer = 0
    let loadingTask: ReturnType<typeof getDocument> | null = null

    const paint = async (width: number) => {
      if (cancelled || width < 32) return
      if (Math.abs(width - renderedWidth) < 2 && pages.childElementCount > 0) {
        return
      }

      renderedWidth = width
      const id = ++requestId
      void loadingTask?.destroy().catch(() => undefined)
      pages.replaceChildren()

      const task = getDocument({
        url,
        disableRange: true,
        disableStream: true,
        useSystemFonts: true,
      })
      loadingTask = task

      try {
        const pdf = await task.promise
        if (cancelled || id !== requestId) return

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          if (cancelled || id !== requestId) return
          const page = await pdf.getPage(pageNumber)
          const base = page.getViewport({ scale: 1 })
          const pageWidth = Math.max(width - 24, 1)
          const viewport = page.getViewport({
            scale: pageWidth / base.width,
          })
          const canvas = document.createElement('canvas')
          const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
          canvas.width = Math.floor(viewport.width * pixelRatio)
          canvas.height = Math.floor(viewport.height * pixelRatio)
          canvas.style.width = `${viewport.width}px`
          canvas.style.height = `${viewport.height}px`
          canvas.className = 'mx-auto block bg-white shadow-sm'
          canvas.setAttribute(
            'aria-label',
            `${title}, pagina ${pageNumber} van ${pdf.numPages}`,
          )
          pages.append(canvas)
          await page.render({
            canvas,
            viewport,
            transform: [pixelRatio, 0, 0, pixelRatio, 0, 0],
          }).promise
          page.cleanup()
        }

        if (!cancelled && id === requestId) onStatus('ready')
      } catch {
        if (!cancelled && id === requestId) {
          pages.replaceChildren()
          onStatus('error')
        }
      }
    }

    const schedule = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        void paint(scroll.clientWidth)
      }, 50)
    }

    const observer = new ResizeObserver(schedule)
    observer.observe(scroll)
    schedule()

    return () => {
      cancelled = true
      requestId += 1
      window.clearTimeout(timer)
      observer.disconnect()
      void loadingTask?.destroy().catch(() => undefined)
    }
  }, [onStatus, title, url])

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto [scrollbar-gutter:stable]">
      <div ref={pagesRef} className="flex flex-col gap-3 p-3" />
    </div>
  )
})

export function PdfDocumentPreview({ url, title }: PdfDocumentPreviewProps) {
  const [status, setStatus] = useState<PreviewStatus>('loading')

  useEffect(() => {
    setStatus('loading')
  }, [url])

  return (
    <div className="relative h-[70dvh] overflow-hidden rounded-xl border border-mist bg-mist/40">
      {status === 'loading' ? (
        <p className="pointer-events-none absolute inset-x-0 top-0 z-10 px-4 py-6 text-sm text-ink/60">
          Handleiding laden…
        </p>
      ) : null}
      {status === 'error' ? (
        <p className="absolute inset-x-0 top-0 z-10 px-4 py-6 text-sm text-destructive">
          Kon de handleiding niet tonen.
        </p>
      ) : null}
      <PdfPages url={url} title={title} onStatus={setStatus} />
    </div>
  )
}
