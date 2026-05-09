const React = require('react')

const SvgMock = React.forwardRef((props, ref) =>
  React.createElement('svg', {...props, ref, 'data-testid': 'svg-mock'}),
)
SvgMock.displayName = 'SvgMock'

module.exports = SvgMock
module.exports.default = SvgMock
module.exports.ReactComponent = SvgMock
