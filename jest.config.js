module.exports = {
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '\\.svg$': '<rootDir>/__mocks__/svgrMock.js',
    '^next/image$': '<rootDir>/__mocks__/NextImage.js',
    '^next/font/(.*)$': '<rootDir>/__mocks__/nextFontMock.js',
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/storybook-static/',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      {presets: [['next/babel', {'preset-react': {runtime: 'automatic'}}]]},
    ],
  },
  roots: ['<rootDir>/components', '<rootDir>/context', '<rootDir>/hooks', '<rootDir>/utils'],
  moduleDirectories: ['node_modules', __dirname],
  testEnvironment: 'jsdom',
  clearMocks: true,
}
