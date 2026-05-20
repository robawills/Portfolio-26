import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {ProjectBody} from '@/components/ProjectBody'
import {ProjectHero} from '@/components/ProjectHero'
import {buildMetadata} from '@/sanity/lib/metadata'
import {getProjectPageData, getProjectSlugs} from '@/sanity/lib/queries'

export async function generateStaticParams() {
  const slugs = await getProjectSlugs()
  return slugs.map((slug) => ({slug}))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{slug: string}>
}): Promise<Metadata> {
  const {slug} = await params
  const project = await getProjectPageData(slug)
  if (!project) return {}
  return buildMetadata({
    seo: project.seo,
    fallback: {title: project.title, description: project.description},
    path: `/projects/${slug}`,
  })
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = await params
  const project = await getProjectPageData(slug)

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
