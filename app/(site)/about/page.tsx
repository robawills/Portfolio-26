import type {Metadata} from 'next'
import classNames from 'classnames/bind'

import {AboutHero} from '@/components/AboutHero'
import {AboutSection} from '@/components/AboutSection'
import {client} from '@/sanity/lib/client'
import {buildMetadata, type SeoFields} from '@/sanity/lib/metadata'

import styles from './about.module.scss'

const cx = classNames.bind(styles)

interface AboutData {
  hero?: string
  bio?: string
  clients?: string[]
  seo?: SeoFields
}

const ABOUT_QUERY = `{
  "about": *[_type == "about"][0]{
    hero,
    bio,
    clients,
    seo{title, description, image{..., asset->{_id}}}
  },
  "skills": *[_type == "skill" && defined(name)] | order(orderRank).name
}`

const FALLBACK_HERO = 'Add an about hero in the Studio.'
const FALLBACK_BIO = 'Add a bio in the Studio.'

function splitParagraphs(value: string): string[] {
  return value
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await client.fetch<{about: AboutData | null}>(
    `{"about": *[_type == "about"][0]{hero, seo{title, description, image{..., asset->{_id}}}}}`,
  )
  return buildMetadata({
    seo: data.about?.seo,
    fallback: {title: 'About', description: data.about?.hero},
    path: '/about',
  })
}

export default async function AboutPage() {
  const {about, skills} = await client.fetch<{
    about: AboutData | null
    skills: string[]
  }>(ABOUT_QUERY)

  const heroCopy = about?.hero ?? FALLBACK_HERO
  const bioParagraphs = splitParagraphs(about?.bio ?? FALLBACK_BIO)
  const clients = about?.clients ?? []

  return (
    <main id="main-content" tabIndex={-1} data-theme="brand-blue">
      <AboutHero title={heroCopy} />

      {bioParagraphs.length > 0 && (
        <AboutSection signpost="Bio">
          {bioParagraphs.map((paragraph, index) => (
            <p key={index} className={cx('bioCopy', 'u-body')}>
              {paragraph}
            </p>
          ))}
        </AboutSection>
      )}

      {skills.length > 0 && (
        <AboutSection signpost="Skills">
          <ul className={cx('skillList', 'u-body')}>
            {skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </AboutSection>
      )}

      {clients.length > 0 && (
        <AboutSection signpost="Brands I've worked with">
          <ul className={cx('clientList', 'u-body')}>
            {clients.map((client) => (
              <li key={client} className={cx('clientItem')}>
                {client}
              </li>
            ))}
          </ul>
        </AboutSection>
      )}
    </main>
  )
}
