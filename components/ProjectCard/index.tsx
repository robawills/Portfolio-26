'use client'

import {useEffect, useRef, useState} from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import Link from 'next/link'
import classNames from 'classnames/bind'

import {Image} from '@/components/Image'
import breakpoints from '@/constants/breakpoints'
import type {ResponsiveFocalPoint} from '@/utils/focal-point'
import styles from './ProjectCard.module.scss'

const cx = classNames.bind(styles)

export interface ProjectCardLink {
  label: string
  href?: string
}

export interface ProjectCardProps {
  image: {
    src: string
    alt: string
    focalPoint?: ResponsiveFocalPoint
  }
  href: string
  title: string
  description: string
  tags?: string[]
  links?: ProjectCardLink[]
}

export const ProjectCard = ({
  image,
  href,
  title,
  description,
  tags,
  links,
}: ProjectCardProps) => {
  const safeTags = tags ?? []
  const safeLinks = links ?? []

  const [open, setOpen] = useState(false)
  const [container, setContainer] = useState<HTMLElement | null>(null)
  const cardRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setContainer(cardRef.current)
  }, [])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen} modal={false}>
      <article ref={cardRef} className={cx('card')}>
        <Link href={href} className={cx('imageLink')} aria-label={`View ${title}`}>
          <div className={cx('imageWrap')}>
            <Image
              className={cx('image')}
              src={image.src}
              alt={image.alt}
              fill
              sizes={`(max-width: ${breakpoints.m}px) 90vw, (max-width: ${breakpoints.oversize}px) 80vw, 1540px`}
              focalPoint={image.focalPoint}
            />
          </div>
        </Link>

        <Dialog.Trigger asChild>
          <button type="button" className={cx('trigger', 'u-signpost', {hidden: open})}>
            <span className={cx('triggerLabel')}>{title}</span>
            <span className={cx('triggerIndicator')} aria-hidden="true">
              <span className={cx('triggerIcon')} />
            </span>
          </button>
        </Dialog.Trigger>

        {container && (
          <Dialog.Portal container={container} forceMount>
            <Dialog.Content
              forceMount
              asChild
              onPointerDownOutside={(e) => e.preventDefault()}
              onInteractOutside={(e) => e.preventDefault()}
            >
              <div className={cx('panel')} aria-hidden={!open}>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className={cx('closeButton')}
                    aria-label="Close project details"
                  >
                    <span className={cx('closeIcon')} aria-hidden="true" />
                  </button>
                </Dialog.Close>
                <Dialog.Title asChild>
                  <h2 className={cx('panelTitle', 'u-h5')}>{title}</h2>
                </Dialog.Title>
                <Dialog.Description asChild>
                  <p className={cx('panelDescription')}>{description}</p>
                </Dialog.Description>
                {(safeTags.length > 0 || safeLinks.length > 0) && (
                  <div className={cx('meta')}>
                    {safeTags.length > 0 && (
                      <div className={cx('metaSection')}>
                        <h3 className={cx('metaHeading', 'u-signpostSmall')}>Tags</h3>
                        <ul className={cx('metaList')}>
                          {safeTags.map((tag) => (
                            <li key={tag} className={cx('metaItem')}>
                              {tag}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {safeLinks.length > 0 && (
                      <div className={cx('metaSection')}>
                        <h3 className={cx('metaHeading', 'u-signpostSmall')}>Links</h3>
                        <ul className={cx('metaList')}>
                          {safeLinks.map((link) => (
                            <li key={link.label} className={cx('metaItem')}>
                              {link.href ? (
                                <a
                                  href={link.href}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={cx('metaLink')}
                                >
                                  {link.label}
                                </a>
                              ) : (
                                link.label
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </article>
    </Dialog.Root>
  )
}

export default ProjectCard
