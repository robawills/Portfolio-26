import type {SanityImageSource} from '@sanity/image-url'
import type {Metadata} from 'next'

import {client} from './client'
import {urlFor} from './image'

export interface SeoFields {
  title?: string
  description?: string
  image?: SanityImageSource & {alt?: string}
}

interface SiteSettings {
  siteTitle?: string
  defaultMetaTitle?: string
  defaultMetaDescription?: string
  defaultShareImage?: SanityImageSource & {alt?: string}
}

const SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  siteTitle,
  defaultMetaTitle,
  defaultMetaDescription,
  defaultShareImage{..., asset->{_id}}
}`

let cachedSettings: SiteSettings | null | undefined

async function getSiteSettings(): Promise<SiteSettings | null> {
  if (cachedSettings !== undefined) return cachedSettings
  cachedSettings = (await client.fetch<SiteSettings | null>(SETTINGS_QUERY)) ?? null
  return cachedSettings
}

const FALLBACK_SITE_TITLE = 'Folio'
const FALLBACK_META_DESCRIPTION =
  'Design and engineering work from a UK-based studio.'
const SHARE_IMAGE_WIDTH = 1200
const SHARE_IMAGE_HEIGHT = 630

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
}

export async function buildMetadata({
  seo,
  fallback,
  absoluteTitle,
}: BuildMetadataArgs): Promise<Metadata> {
  const settings = await getSiteSettings()

  const siteTitle = settings?.siteTitle ?? FALLBACK_SITE_TITLE
  const title =
    seo?.title ?? fallback?.title ?? settings?.defaultMetaTitle ?? siteTitle
  const description =
    seo?.description ??
    fallback?.description ??
    settings?.defaultMetaDescription ??
    FALLBACK_META_DESCRIPTION

  const share =
    resolveShareImage(seo?.image) ??
    resolveShareImage(settings?.defaultShareImage)

  return {
    title: absoluteTitle ? {absolute: title} : title,
    description,
    openGraph: {
      title,
      description,
      siteName: siteTitle,
      type: 'website',
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
