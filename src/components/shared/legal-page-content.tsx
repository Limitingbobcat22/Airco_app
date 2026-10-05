import { COMPANY, LEGAL_PAGES } from '@/lib/company'
import { cn } from '@/lib/utils'

type LegalPage = (typeof LEGAL_PAGES)[keyof typeof LEGAL_PAGES]
type LegalArticlesList = Extract<LegalPage, { articles: readonly unknown[] }>['articles']

function LegalText({ text }: { text: string }) {
  const email = COMPANY.email
  if (!text.includes(email)) return text

  const [before, after] = text.split(email)
  return (
    <>
      {before}
      <a
        href={`mailto:${email}`}
        className="font-medium text-[#74b8f8] underline decoration-[#74b8f8]/40 underline-offset-2 hover:text-[#5aa6ef]"
      >
        {email}
      </a>
      {after}
    </>
  )
}

function LegalArticles({ articles }: { articles: LegalArticlesList }) {
  return (
    <div className="mt-5 divide-y divide-mist">
      {articles.map((article) => {
        const useBullets = 'bullets' in article && article.bullets
        const ListTag = useBullets ? 'ul' : 'ol'
        return (
          <article key={article.title} className="py-4 first:pt-0 last:pb-1">
            <h3 className="text-sm font-semibold text-ink">{article.title}</h3>
            {'lead' in article ? (
              <p className="mt-2 text-sm leading-relaxed text-ink/75">
                <LegalText text={article.lead} />
              </p>
            ) : null}
            {'items' in article ? (
              <ListTag
                className={cn(
                  'mt-2 space-y-2 pl-5 text-sm leading-relaxed text-ink/75 marker:text-[#74b8f8]',
                  useBullets ? 'list-disc' : 'list-decimal marker:font-medium',
                )}
              >
                {article.items.map((item) => (
                  <li key={item} className="pl-1">
                    <LegalText text={item} />
                  </li>
                ))}
              </ListTag>
            ) : null}
          </article>
        )
      })}
    </div>
  )
}

export function LegalPageContent({ page }: { page: LegalPage }) {
  return (
    <div
      className={cn(
        'pr-8',
        'articles' in page && 'max-h-[min(72vh,42rem)] overflow-y-auto',
      )}
    >
      <p className="text-xs font-medium tracking-[0.2em] text-[#74b8f8] uppercase">
        Juridisch
      </p>
      <h2 className="mt-2 font-display text-2xl text-ink">{page.title}</h2>
      {'intro' in page ? (
        <p className="mt-4 text-sm leading-relaxed text-ink/75">{page.intro}</p>
      ) : null}
      {'articles' in page ? <LegalArticles articles={page.articles} /> : null}
    </div>
  )
}
