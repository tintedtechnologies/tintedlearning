/**
 * Turns a Google Form's public link (ending in /viewform) into the endpoint that accepts responses
 * (ending in /formResponse). Responses are posted to this endpoint with the form's entry.* field names.
 * Returns an empty string when no link is configured.
 */
export function toFormResponseUrl(viewformUrl: string | undefined): string {
  const trimmed = viewformUrl?.trim()
  if (!trimmed) return ''

  try {
    const url = new URL(trimmed)
    url.pathname = url.pathname.replace(/\/viewform$/, '/formResponse')
    url.search = ''
    return url.toString()
  } catch {
    return trimmed
  }
}
