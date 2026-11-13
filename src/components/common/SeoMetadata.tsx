import { useEffect } from 'react'

interface SeoMetadataProps {
  title: string
  description: string
}

const siteName = 'Tinted Learning'
const defaultImage = '/tintedlearninglogo.png'

function setMeta(name: string, content: string, attribute = 'name') {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, name)
    document.head.appendChild(element)
  }
  element.content = content
}

export function SeoMetadata({ title, description }: SeoMetadataProps) {
  useEffect(() => {
    const pageTitle = `${title} | ${siteName}`
    const canonicalUrl = `${window.location.origin}${window.location.pathname}`
    const imageUrl = `${window.location.origin}${defaultImage}`

    document.title = pageTitle
    setMeta('description', description)
    setMeta('og:title', pageTitle, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:url', canonicalUrl, 'property')
    setMeta('og:type', 'website', 'property')
    setMeta('og:image', imageUrl, 'property')
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', pageTitle)
    setMeta('twitter:description', description)
    setMeta('twitter:image', imageUrl)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalUrl
  }, [description, title])

  return null
}