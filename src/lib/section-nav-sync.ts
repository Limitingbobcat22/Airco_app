/** Voorkomt scroll-jank wanneer de URL door scroll-spy wordt bijgewerkt. */
let suppressNextSectionScroll = false

export function markPathUpdatedFromScroll() {
  suppressNextSectionScroll = true
}

export function consumeSuppressSectionScroll() {
  if (!suppressNextSectionScroll) return false
  suppressNextSectionScroll = false
  return true
}
