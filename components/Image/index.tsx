'use client'

import {useState, useEffect} from 'react'
import NextImage, {type ImageProps as NextImageProps, type ImageLoader} from 'next/image'
import classNames from 'classnames/bind'

import type {ResponsiveFocalPoint, FocalPoint} from '@/utils/focal-point'
import {focalPointToCss} from '@/utils/focal-point'
import styles from './Image.module.scss'

const cx = classNames.bind(styles)

export interface ImageProps extends NextImageProps {
  /** Extra class merged onto the rendered `<img>` element. */
  className?: string
  /** Colour of the placeholder shown until the image loads. `none` skips the placeholder entirely. */
  placeholderColor?: 'default' | 'none' | 'dark'
  /**
   * Force the Sanity image loader (auto-detected when the src is on `cdn.sanity.io`).
   * Adds `auto=format`, `fit=max`, and width/quality params to the asset URL.
   */
  sanity?: boolean
  /**
   * Where to anchor the image when it's cropped via `object-fit: cover`.
   * A single string applies across breakpoints, or pass `{mobile, tablet, desktop}` for responsive overrides.
   */
  focalPoint?: ResponsiveFocalPoint
}

const resolveFocalPoint = (
  focalPoint: ResponsiveFocalPoint,
): {mobile?: FocalPoint; tablet?: FocalPoint; desktop?: FocalPoint} => {
  if (typeof focalPoint === 'string') {
    return {mobile: focalPoint, tablet: focalPoint, desktop: focalPoint}
  }
  return focalPoint
}

const sanityLoader: ImageLoader = ({src, width, quality}) => {
  const url = new URL(src, 'https://dummy')
  if (url.hostname === 'dummy') return src

  const w = Math.max(1, Math.round(width))
  url.searchParams.set('w', String(w))

  if (typeof quality === 'number') {
    const q = Math.min(100, Math.max(0, Math.round(quality)))
    if (!url.searchParams.has('q')) url.searchParams.set('q', String(q))
  }

  if (!url.searchParams.has('auto') && !url.searchParams.has('fm')) {
    url.searchParams.set('auto', 'format')
  }

  const callerChoseFit = url.searchParams.has('fit')
  const hasCropOrHeight =
    url.searchParams.has('h') || url.searchParams.has('rect') || url.searchParams.has('crop')

  if (!callerChoseFit && !hasCropOrHeight) {
    url.searchParams.set('fit', 'max')
  }

  return url.toString()
}

export const Image: React.FC<ImageProps> = ({
  className,
  placeholderColor = 'default',
  sanity = false,
  focalPoint,
  ...imageProps
}) => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(false)
  }, [imageProps.src])

  const handleImageLoad = () => setIsLoaded(true)

  const srcString = typeof imageProps.src === 'string' ? imageProps.src : ''
  const isSanityHost = srcString.includes('cdn.sanity.io')
  const isAbsoluteUrl = srcString.startsWith('http')
  const useSanityLoader = (sanity || isSanityHost) && isAbsoluteUrl

  let focalPointStyles: React.CSSProperties = {}

  if (focalPoint) {
    const resolved = resolveFocalPoint(focalPoint)
    const bps: Array<keyof typeof resolved> = ['mobile', 'tablet', 'desktop']

    focalPointStyles = bps.reduce(
      (acc, bp) => {
        if (resolved[bp]) {
          acc[`--focal-point-${bp}`] = focalPointToCss(resolved[bp]!)
        }
        return acc
      },
      {} as Record<string, string>,
    )
  }

  return (
    <div className={cx('imageWrap')}>
      {placeholderColor && (
        <div
          className={cx('placeholder', placeholderColor, {isLoaded})}
          data-testid={`placeholder-${placeholderColor}`}
        />
      )}
      <NextImage
        key={imageProps.src as string}
        {...imageProps}
        loader={useSanityLoader ? sanityLoader : imageProps.loader}
        className={cx('image', className, {isLoaded})}
        style={{...imageProps.style, ...focalPointStyles}}
        onLoad={handleImageLoad}
        data-testid="image"
        quality={85}
      />
    </div>
  )
}

export default Image
