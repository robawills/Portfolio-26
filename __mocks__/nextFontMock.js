const fontMock = () => ({
  className: 'mock-font',
  variable: '--mock-font',
  style: {fontFamily: 'mock'},
})

module.exports = new Proxy(
  {},
  {
    get: () => fontMock,
  },
)
