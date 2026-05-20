import type {SanityImageSource} from '@sanity/image-url'

export interface SeoFields {
  title?: string
  description?: string
  image?: SanityImageSource & {alt?: string}
}

export interface SanityImage {
  alt?: string
  asset?: {
    _id: string
    metadata?: {dimensions?: {width: number; height: number}}
  }
}

export interface ProjectLink {
  _key: string
  title: string
  url: string
}

export interface HomeData {
  heroTitle?: string
  description?: string
  heroImage?: SanityImage
  aboutBuildSignpost?: string
  aboutBuildDescription?: string
  seo?: SeoFields
}

export interface ProjectCard {
  _id: string
  title: string
  slug: string
  descriptionCard: string
  cover?: SanityImage
  coverMobile?: SanityImage
  skillNames?: string[]
  links?: ProjectLink[]
}

export interface ClientDoc {
  name?: string
}

export interface AboutData {
  hero?: string
  bio?: string
  clients?: string[]
  seo?: SeoFields
}

export interface SiteSettings {
  siteTitle?: string
  defaultMetaTitle?: string
  defaultMetaDescription?: string
  defaultShareImage?: SanityImageSource & {alt?: string}
}
