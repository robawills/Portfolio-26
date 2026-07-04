import type {SanityImageSource} from '@sanity/image-url'
import type {Metadata} from 'next'

import {urlFor} from './image'
import {getSiteSettings} from './queries'
import type {SeoFields} from './types'

export type {SeoFields} from './types'

const FALLBACK_SITE_TITLE = 'Rob Wills Portfolio'
const FALLBACK_META_DESCRIPTION =
  'The portfolio of Rob Wills, a Senior Frontend Engineer building React, Next.js and TypeScript in production.'
const SHARE_IMAGE_WIDTH = 1200
const SHARE_IMAGE_HEIGHT = 630
const FALLBACK_DESCRIPTION_MAX = 155

// Body-copy descriptions can be paragraphs; meta needs a snippet.
function truncateForMeta(value: string): string {
  const collapsed = value.replace(/\s+/g, ' ').trim()
  if (collapsed.length <= FALLBACK_DESCRIPTION_MAX) return collapsed
  const slice = collapsed.slice(0, FALLBACK_DESCRIPTION_MAX)
  const lastSpace = slice.lastIndexOf(' ')
  const trimmed = lastSpace > 80 ? slice.slice(0, lastSpace) : slice
  return `${trimmed.replace(/[.,;:!?-]+$/, '')}…`
}

function resolveShareImage(
  image: (SanityImageSource & {alt?: string}) | undefined,
): {url: string; alt: string} | null {
  if (!image) return null
  const url = urlFor(image)
    .width(SHARE_IMAGE_WIDTH)
    .height(SHARE_IMAGE_HEIGHT)
    .fit('crop')
    .auto('format')
    .url()
  return {url, alt: image.alt ?? ''}
}

export interface BuildMetadataArgs {
  seo?: SeoFields
  fallback?: {title?: string; description?: string}
  /** Skip the site-title template (use on the site root). */
  absoluteTitle?: boolean
  /** Page path (e.g. "/projects/kyan"). Becomes the canonical URL. */
  path?: string
}

export async function buildMetadata({
  seo,
  fallback,
  absoluteTitle,
  path,
}: BuildMetadataArgs): Promise<Metadata> {
  const settings = await getSiteSettings()

  const siteTitle = settings?.siteTitle ?? FALLBACK_SITE_TITLE
  const title =
    seo?.title ?? fallback?.title ?? settings?.defaultMetaTitle ?? siteTitle
  // seo.description is editor-authored as a meta snippet — trust their length.
  // fallback.description is body copy that may be paragraphs long — truncate.
  const description = seo?.description
    ? seo.description
    : fallback?.description
      ? truncateForMeta(fallback.description)
      : (settings?.defaultMetaDescription ?? FALLBACK_META_DESCRIPTION)

  const share =
    resolveShareImage(seo?.image) ??
    resolveShareImage(settings?.defaultShareImage)

  // If an editor explicitly wrote a meta title in the SEO panel, treat it as
  // absolute so the "· Site title" template doesn't push it past 60 chars.
  const useAbsolute = absoluteTitle || Boolean(seo?.title)

  return {
    title: useAbsolute ? {absolute: title} : title,
    description,
    alternates: path ? {canonical: path} : undefined,
    openGraph: {
      title,
      description,
      siteName: siteTitle,
      type: 'website',
      url: path,
      images: share
        ? [
            {
              url: share.url,
              width: SHARE_IMAGE_WIDTH,
              height: SHARE_IMAGE_HEIGHT,
              alt: share.alt,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: share ? [share.url] : undefined,
    },
  }
}
