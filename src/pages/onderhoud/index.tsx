import SiteFooter from '@/components/shared/site-footer'

export default function OnderhoudPage() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div id="page-scroll" className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex min-h-full flex-col">
          <article className="hero-bg relative flex-1 overflow-hidden px-4 py-10 sm:px-6 sm:py-14">
            <div className="relative mx-auto max-w-3xl">
              <p className="text-sm font-medium tracking-[0.22em] text-ink uppercase">
                Service
              </p>
              <h1 className="mt-2 font-display text-3xl text-ink sm:text-5xl">
                Onderhoud
              </h1>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-ink/75 sm:text-lg">
                <p>
                  Regelmatig onderhoud houdt uw airco of ketel zuinig, stil en
                  betrouwbaar. Hier leest u straks wat een onderhoudsbeurt
                  inhoudt en wanneer die nodig is.
                </p>
                <p>
                  Deze tekst is een tijdelijke placeholder. De definitieve
                  uitleg over onderhoud, afspraken en service komt hier later.
                </p>
              </div>
            </div>
          </article>
          <SiteFooter />
        </div>
      </div>
    </div>
  )
}
