/* eslint-disable */
export default {
  displayName: 'style-dictionary-e2e',
  preset: '../../jest.preset.js',
  testTimeout: 240_000,
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/e2e/style-dictionary-e2e',
};
