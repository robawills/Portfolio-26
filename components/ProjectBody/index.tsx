import classNames from 'classnames/bind'

import {AboutBuild} from '@/components/AboutBuild'
import {MediaGroup, MediaGroupImage} from '@/components/MediaGroup'
import {urlFor} from '@/sanity/lib/image'

import styles from './ProjectBody.module.scss'

const cx = classNames.bind(styles)

export type MediaSize = 'full' | 'half' | 'max' | 'mega'

interface MediaGroupItem {
  /** Sanity array item key. */
  _key: string
  /** Layout size for the image within the group. */
  size: MediaSize
  /** Image data resolved from Sanity. */
  image: {
    /** Alt text describing the image. */
    alt?: string
    /** Sanity asset reference. */
    asset?: {_id: string}
  }
}

export interface MediaGroupBlock {
  _type: 'mediaGroupBlock'
  /** Sanity array item key. */
  _key: string
  /** Ordered images that make up this group. */
  items?: MediaGroupItem[]
}

export interface AboutBuildBlock {
  _type: 'aboutBuildBlock'
  /** Sanity array item key. */
  _key: string
  /** Small uppercase label above the description. */
  signpost?: string
  /** Paragraph describing the build / approach. */
  description?: string
  /** Resolved skill names (joined from referenced skill documents). */
  skillNames?: string[]
  /** Resolved expertise names (joined from referenced expertise documents). */
  expertiseNames?: string[]
}

export type ProjectBodyBlock = MediaGroupBlock | AboutBuildBlock

export interface ProjectBodyProps {
  /** Ordered list of content blocks (media groups + build sections) — typically the project's `body` from Sanity. */
  body?: ProjectBodyBlock[]
}

export const ProjectBody = ({body}: ProjectBodyProps) => {
  if (!body || body.length === 0) return null

  return (
    <div className={cx('body')}>
      {body.map((block) => {
        if (block._type === 'mediaGroupBlock') {
          const items = (block.items ?? []).filter((item) => item.image?.asset)
          if (items.length === 0) return null
          return (
            <MediaGroup key={block._key}>
              {items.map((item) => (
                <MediaGroupImage
                  key={item._key}
                  src={urlFor(item.image)
                    .width(1600)
                    .fit('max')
                    .auto('format')
                    .url()}
                  metaTitle={item.image.alt ?? ''}
                  size={item.size}
                />
              ))}
            </MediaGroup>
          )
        }

        if (block._type === 'aboutBuildBlock') {
          return (
            <AboutBuild
              key={block._key}
              signpost={block.signpost || 'Build'}
              description={block.description}
              skills={block.skillNames}
              expertise={block.expertiseNames}
            />
          )
        }

        return null
      })}
    </div>
  )
}

export default ProjectBody
