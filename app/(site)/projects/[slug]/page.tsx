import {notFound} from 'next/navigation'

import {ProjectBody, type ProjectBodyBlock} from '@/components/ProjectBody'
import {ProjectHero} from '@/components/ProjectHero'
import {client} from '@/sanity/lib/client'

const PROJECT_QUERY = `*[_type == "project" && slug.current == $slug][0]{
  title,
  description,
  links[]{_key, title, url},
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
}

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(SLUGS_QUERY)
  return slugs.map((slug) => ({slug}))
}

export default async function ProjectPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const project = await client.fetch<Project | null>(PROJECT_QUERY, {slug})

  if (!project) notFound()

  return (
    <main>
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
