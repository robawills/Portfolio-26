import type {Metadata} from 'next'

import {AboutBio} from '@/components/AboutBio'
import {AboutClients} from '@/components/AboutClients'
import {AboutHero} from '@/components/AboutHero'
import {AboutSkills} from '@/components/AboutSkills'
import {buildMetadata} from '@/sanity/lib/metadata'
import {getAboutPageData} from '@/sanity/lib/queries'

const FALLBACK_HERO = 'Add an about hero in the Studio.'
const FALLBACK_BIO = 'Add a bio in the Studio.'

export async function generateMetadata(): Promise<Metadata> {
  const {about} = await getAboutPageData()
  return buildMetadata({
    seo: about?.seo,
    fallback: {title: 'About', description: about?.hero},
    path: '/about',
  })
}

export default async function AboutPage() {
  const {about, skills} = await getAboutPageData()

  return (
    <main id="main-content" tabIndex={-1} data-theme="brand-blue">
      <AboutHero title={about?.hero ?? FALLBACK_HERO} />
      <AboutBio bio={about?.bio ?? FALLBACK_BIO} />
      <AboutSkills skills={skills} />
      <AboutClients clients={about?.clients ?? []} />
    </main>
  )
}
