import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {ProjectBody, type ProjectBodyBlock} from '@/components/ProjectBody'
import {ProjectHero} from '@/components/ProjectHero'
import {client} from '@/sanity/lib/client'
import {buildMetadata, type SeoFields} from '@/sanity/lib/metadata'

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

const SLUGS_QUERY = `*[_type == "project" && defined(slug.current)][].slug.current`

type ProjectLink = {_key: string; title: string; url: string}

type Project = {
  title: string
  description: string
  links?: ProjectLink[]
  body?: ProjectBodyBlock[]
  seo?: SeoFields
}

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(SLUGS_QUERY)
  return slugs.map((slug) => ({slug}))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{slug: string}>
}): Promise<Metadata> {
  const {slug} = await params
  const project = await client.fetch<Project | null>(PROJECT_QUERY, {slug})
  if (!project) return {}
  return buildMetadata({
    seo: project.seo,
    fallback: {title: project.title, description: project.description},
    path: `/projects/${slug}`,
  })
}

export default async function ProjectPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const project = await client.fetch<Project | null>(PROJECT_QUERY, {slug})

  if (!project) notFound()

  return (
    <main id="main-content" tabIndex={-1}>
      <ProjectHero
        title={project.title}
        description={project.description}
        links={(project.links ?? []).map((link) => ({
          key: link._key,
          title: link.title,
          url: link.url,
        }))}
      />

      <ProjectBody body={project.body} />
    </main>
  )
}
