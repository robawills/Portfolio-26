import {cache} from 'react'

import type {ProjectBodyBlock} from '@/components/ProjectBody'

import {client} from './client'
import type {
  AboutData,
  ClientDoc,
  HomeData,
  ProjectCard,
  ProjectLink,
  SeoFields,
  SiteSettings,
} from './types'

const HOME_QUERY = `{
  "home": *[_type == "home"][0]{
    heroTitle,
    description,
    heroImage{..., asset->{_id, metadata{dimensions}}},
    aboutBuildSignpost,
    aboutBuildDescription,
    seo{title, description, image{..., asset->{_id}}}
  },
  "projects": *[_type == "project"] | order(orderRank){
    _id,
    title,
    "slug": slug.current,
    descriptionCard,
    "cover": cardImage{..., asset->{_id, metadata{dimensions}}},
    "coverMobile": cardImageMobile{..., asset->{_id, metadata{dimensions}}},
    "skillNames": body[_type == "aboutBuildBlock"][0].skills[]->name,
    links[]{_key, title, url}
  },
  "clients": *[_type == "client"] | order(name asc){name}
}`

const ABOUT_QUERY = `{
  "about": *[_type == "about"][0]{
    hero,
    bio,
    clients,
    seo{title, description, image{..., asset->{_id}}}
  },
  "skills": *[_type == "skill" && defined(name)] | order(orderRank).name
}`

const PROJECT_QUERY = `*[_type == "project" && slug.current == $slug][0]{
  title,
  description,
  links[]{_key, title, url},
  seo{title, description, image{..., asset->{_id}}},
  body[]{
    _key,
    _type,
    _type == "mediaGroupBlock" => {
      items[]{
        _key,
        size,
        image{..., asset->{_id}}
      }
    },
    _type == "aboutBuildBlock" => {
      signpost,
      description,
      "skillNames": skills[]->name,
      "expertiseNames": expertise[]->name
    }
  }
}`

const PROJECT_SLUGS_QUERY = `*[_type == "project" && defined(slug.current)][].slug.current`

const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  siteTitle,
  defaultMetaTitle,
  defaultMetaDescription,
  defaultShareImage{..., asset->{_id}}
}`

export interface HomePageData {
  home: HomeData | null
  projects: ProjectCard[]
  clients: ClientDoc[]
}

export interface AboutPageData {
  about: AboutData | null
  skills: string[]
}

export interface ProjectPageData {
  title: string
  description: string
  links?: ProjectLink[]
  body?: ProjectBodyBlock[]
  seo?: SeoFields
}

// `cache()` dedupes calls within a single request so `generateMetadata`
// and the page component share one Sanity round-trip per page render.
export const getHomePageData = cache(
  async (): Promise<HomePageData> => client.fetch<HomePageData>(HOME_QUERY),
)

export const getAboutPageData = cache(
  async (): Promise<AboutPageData> => client.fetch<AboutPageData>(ABOUT_QUERY),
)

export const getProjectPageData = cache(
  async (slug: string): Promise<ProjectPageData | null> =>
    client.fetch<ProjectPageData | null>(PROJECT_QUERY, {slug}),
)

export const getProjectSlugs = cache(
  async (): Promise<string[]> => client.fetch<string[]>(PROJECT_SLUGS_QUERY),
)

export const getSiteSettings = cache(
  async (): Promise<SiteSettings | null> =>
    (await client.fetch<SiteSettings | null>(SITE_SETTINGS_QUERY)) ?? null,
)
