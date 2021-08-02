process.env.TZ = 'GMT';

module.exports = {
  clearMocks: true,
  testEnvironment: 'node',
  setupFilesAfterEnv: [],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js'],
  coverageReporters: ['json', 'html', 'text', 'text-summary'],
  coveragePathIgnorePatterns: ['node_modules'],
  coverageThreshold: {
    global: {
      branches: 96,
      functions: 100,
      lines: 97,
      statements: 97,
    },
  },
  moduleDirectories: ['node_modules', 'src'],
};
