/* eslint-disable */
export default {
  displayName: 'playwright-e2e',
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
  coverageDirectory: '../../coverage/e2e/playwright-e2e',
};
