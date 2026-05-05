import Image from 'next/image'
import {notFound} from 'next/navigation'
import {client} from '@/sanity/lib/client'
import {urlFor} from '@/sanity/lib/image'

const PROJECT_QUERY = `*[_type == "project" && slug.current == $slug][0]{
  title,
  description,
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
      <h1>{project.title}</h1>
        <p>{project.description}</p>

        {project.expertise && project.expertise.length > 0 && (
          <section>
            <h2>Expertise</h2>
            <ul>
              {project.expertise.map((item) => (
                <li key={item._id}>{item.name}</li>
              ))}
            </ul>
          </section>
        )}

        {project.skills && project.skills.length > 0 && (
          <section>
            <h2>Skills</h2>
            <ul>
              {project.skills.map((item) => (
                <li key={item._id}>{item.name}</li>
              ))}
            </ul>
          </section>
        )}

        {project.links && project.links.length > 0 && (
          <section>
            <h2>Links</h2>
            <ul>
              {project.links.map((link) => (
                <li key={link._key}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

      {project.images?.map((image, i) => {
        const dims = image.asset?.metadata?.dimensions
        if (!image.asset || !dims) return null
        return (
          <Image
            key={image._key}
            src={urlFor(image).width(1600).fit('max').auto('format').url()}
            alt={image.alt ?? ''}
            width={dims.width}
            height={dims.height}
            sizes="(max-width: 768px) 100vw, 1200px"
            priority={i === 0}
          />
        )
      })}
    </main>
  )
}
