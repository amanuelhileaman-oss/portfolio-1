export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'routes/**/*.js',
    '!routes/**/*.test.js'
  ],
  testPathIgnorePatterns: ['/node_modules/'],
  modulePathIgnorePatterns: ['/node_modules/']
};
