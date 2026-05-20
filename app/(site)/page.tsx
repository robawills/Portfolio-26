import type {Metadata} from 'next'

import {AboutBuild} from '@/components/AboutBuild'
import {ClientMarquee} from '@/components/ClientMarquee'
import {HomeHero} from '@/components/HomeHero'
import {ProjectGrid} from '@/components/ProjectGrid'
import {urlFor} from '@/sanity/lib/image'
import {buildMetadata} from '@/sanity/lib/metadata'
import {getHomePageData} from '@/sanity/lib/queries'

export async function generateMetadata(): Promise<Metadata> {
  const {home} = await getHomePageData()
  return buildMetadata({
    seo: home?.seo,
    fallback: {title: home?.heroTitle, description: home?.description},
    absoluteTitle: true,
    path: '/',
  })
}

export default async function HomePage() {
  const {home, projects, clients} = await getHomePageData()

  const clientNames = clients
    .map((c) => c.name)
    .filter((name): name is string => Boolean(name))

  const projectCards = projects
    .filter((project) => project.cover?.asset)
    .map((project) => ({
      href: `/projects/${project.slug}`,
      title: project.title,
      description: project.descriptionCard,
      image: {
        src: urlFor(project.cover!).width(1600).fit('max').auto('format').url(),
        alt: project.cover!.alt ?? project.title,
      },
      mobileImage: project.coverMobile?.asset
        ? {
            src: urlFor(project.coverMobile)
              .width(900)
              .fit('max')
              .auto('format')
              .url(),
            alt: project.coverMobile.alt ?? project.title,
          }
        : undefined,
      tags: project.skillNames,
      links: (project.links ?? []).map((link) => ({
        label: link.title,
        href: link.url,
      })),
    }))

  return (
    <main id="main-content" tabIndex={-1}>
      <HomeHero
        title={home?.heroTitle ?? 'Add a hero title in the Studio'}
        description={home?.description ?? 'Add a description in the Studio'}
      />

      {projectCards.length > 0 ? (
        <ProjectGrid projects={projectCards} />
      ) : (
        <p>No projects yet — add one in the Studio.</p>
      )}

      <AboutBuild
        signpost={home?.aboutBuildSignpost ?? undefined}
        description={home?.aboutBuildDescription ?? undefined}
      />

      <ClientMarquee clients={clientNames} />
    </main>
  )
}
