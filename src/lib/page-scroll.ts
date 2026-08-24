const PAGE_SCROLL_ID = 'page-scroll'

export function scrollToPageSection(
  sectionId: string | null,
  behavior: ScrollBehavior = 'smooth',
) {
  const root = document.getElementById(PAGE_SCROLL_ID)
  if (!root) return

  if (!sectionId) {
    root.scrollTo({ top: 0, behavior })
    return
  }

  const target = document.getElementById(sectionId)
  if (!target) return

  const rootRect = root.getBoundingClientRect()
  const targetRect = target.getBoundingClientRect()
  const scrollMarginTop =
    Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0
  const top =
    root.scrollTop + (targetRect.top - rootRect.top) - scrollMarginTop

  root.scrollTo({ top: Math.max(0, top), behavior })
}
