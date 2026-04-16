module.exports = {
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '\\.svg': '<rootDir>/__mocks__/svgrMock.js',
    '\\.png': '<rootDir>/__mocks__/pngMock.js',
    '\\.jpg': '<rootDir>/__mocks__/jpgMock.js',
    'next/image': '<rootDir>/__mocks__/NextImage.js',
    '^framer-motion$': '<rootDir>/__mocks__/framer-motion.js',
    '^motion/react$': '<rootDir>/__mocks__/framer-motion.js',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/constants/(.*)$': '<rootDir>/constants/$1',
    '^@/context/(.*)$': '<rootDir>/context/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@/utils/(.*)$': '<rootDir>/utils/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/interfaces/(.*)$': '<rootDir>/interfaces/$1',
    '^@styles/(.*)$': '<rootDir>/styles/$1',
    '^@/data/(.*)$': '<rootDir>/data/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      {
        presets: [
          [
            'next/babel',
            {
              'preset-react': {
                runtime: 'automatic',
              },
            },
          ],
        ],
      },
    ],
  },
  roots: [
    'components',
    'pages',
    'constants',
    'context',
    'hooks',
    'utils',
    'lib',
    'interfaces',
  ],
  moduleDirectories: ['node_modules', __dirname],
  testEnvironment: 'jsdom',
  clearMocks: true,
};
