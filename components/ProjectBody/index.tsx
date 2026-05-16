import classNames from 'classnames/bind'

import {AboutBuild} from '@/components/AboutBuild'
import {MediaGroup, MediaGroupImage} from '@/components/MediaGroup'
import {urlFor} from '@/sanity/lib/image'

import styles from './ProjectBody.module.scss'

const cx = classNames.bind(styles)

export type MediaSize = 'full' | 'half' | 'max' | 'mega'

interface MediaGroupItem {
  _key: string
  size: MediaSize
  image: {
    alt?: string
    asset?: {_id: string}
  }
}

export interface MediaGroupBlock {
  _type: 'mediaGroupBlock'
  _key: string
  items?: MediaGroupItem[]
}

export interface AboutBuildBlock {
  _type: 'aboutBuildBlock'
  _key: string
  signpost?: string
  description?: string
  skillNames?: string[]
  expertiseNames?: string[]
}

export type ProjectBodyBlock = MediaGroupBlock | AboutBuildBlock

export interface ProjectBodyProps {
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
