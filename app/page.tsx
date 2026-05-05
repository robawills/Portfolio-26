import {ExpertiseDetailHero} from '@/components/ExpertiseDetailHero'
import {ProjectGrid} from '@/components/ProjectGrid'
import {client} from '@/sanity/lib/client'
import {urlFor} from '@/sanity/lib/image'

const HOME_QUERY = `{
  "home": *[_type == "home"][0]{
    heroTitle,
    description,
    heroImage{..., asset->{_id, metadata{dimensions}}}
  },
  "projects": *[_type == "project"] | order(_createdAt desc){
    _id,
    title,
    "slug": slug.current,
    description,
    "cover": images[0]{..., asset->{_id, metadata{dimensions}}},
    "skillNames": skills[]->name,
    links[]{_key, title, url}
  }
}`

type SanityImage = {
  alt?: string
  asset?: {
    _id: string
    metadata?: {dimensions?: {width: number; height: number}}
  }
}

type Home = {
  heroTitle?: string
  description?: string
  heroImage?: SanityImage
}

type Project = {
  _id: string
  title: string
  slug: string
  description: string
  cover?: SanityImage
  skillNames?: string[]
  links?: {_key: string; title: string; url: string}[]
}

export default async function HomePage() {
  const {home, projects} = await client.fetch<{home: Home | null; projects: Project[]}>(HOME_QUERY)

  const heroSrc = home?.heroImage?.asset
    ? urlFor(home.heroImage).width(1920).fit('max').auto('format').url()
    : null

  const projectCards = projects
    .filter((project) => project.cover?.asset)
    .map((project) => ({
      href: `/projects/${project.slug}`,
      title: project.title,
      description: project.description,
      image: {
        src: urlFor(project.cover!).width(1600).fit('max').auto('format').url(),
        alt: project.cover!.alt ?? project.title,
      },
      tags: project.skillNames,
      links: (project.links ?? []).map((link) => ({label: link.title, href: link.url})),
    }))

  return (
    <main>
      {home?.heroTitle && home.description && heroSrc ? (
        <ExpertiseDetailHero
          signpost="Portfolio"
          title={home.heroTitle}
          intro={home.description}
          image={{src: heroSrc, alt: home.heroImage?.alt ?? ''}}
        />
      ) : (
        <>
          <h1>{home?.heroTitle ?? 'Add a hero title in the Studio'}</h1>
          <p>{home?.description ?? 'Add a description in the Studio'}</p>
        </>
      )}

      {projectCards.length > 0 ? (
        <ProjectGrid projects={projectCards} />
      ) : (
        <p>No projects yet — add one in the Studio.</p>
      )}
    </main>
  )
}
