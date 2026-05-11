import {notFound} from 'next/navigation'

import {AboutBuild} from '@/components/AboutBuild'
import {MediaGroup, MediaGroupImage} from '@/components/MediaGroup'
import {ProjectHero} from '@/components/ProjectHero'
import {client} from '@/sanity/lib/client'
import {urlFor} from '@/sanity/lib/image'

const PROJECT_QUERY = `*[_type == "project" && slug.current == $slug][0]{
  title,
  description,
  build,
  images[]{..., asset->{_id, metadata{dimensions}}},
  skills[]->{_id, name},
  expertise[]->{_id, name},
  links[]{_key, title, url}
}`

const SLUGS_QUERY = `*[_type == "project" && defined(slug.current)][].slug.current`

type SanityImage = {
  _key: string
  alt?: string
  asset?: {
    _id: string
    metadata?: {dimensions?: {width: number; height: number}}
  }
}

type Tag = {_id: string; name: string}
type ProjectLink = {_key: string; title: string; url: string}

type Project = {
  title: string
  description: string
  build?: string
  images?: SanityImage[]
  skills?: Tag[]
  expertise?: Tag[]
  links?: ProjectLink[]
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

      <AboutBuild
        signpost="Build"
        description={project.build}
        skills={project.skills?.map((s) => s.name)}
        expertise={project.expertise?.map((e) => e.name)}
      />

      {project.images && project.images.length > 0 && (
        <MediaGroup>
          {project.images
            .filter((image) => image.asset)
            .map((image) => (
              <MediaGroupImage
                key={image._key}
                src={urlFor(image)
                  .width(1600)
                  .fit('max')
                  .auto('format')
                  .url()}
                metaTitle={image.alt ?? ''}
                size="full"
              />
            ))}
        </MediaGroup>
      )}
    </main>
  )
}
