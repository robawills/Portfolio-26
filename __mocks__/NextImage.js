const React = require('react')

const NextImage = React.forwardRef((props, ref) => {
  const {src, alt, fill, sizes, priority, quality, loader, placeholder, blurDataURL, onLoad, ...rest} = props
  const resolvedSrc = typeof src === 'string' ? src : src?.src ?? ''
  return React.createElement('img', {...rest, src: resolvedSrc, alt, ref})
})
NextImage.displayName = 'NextImage'

module.exports = NextImage
module.exports.default = NextImage
