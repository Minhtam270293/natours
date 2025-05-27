const commonConfig = require('./jest.config');

module.exports = {
  ...commonConfig,
  testMatch: ['**/tests/e2e/**/*.e2e.test.{js,ts}'],
  testTimeout: 30000, // E2E tests can take longer
  coverageDirectory: 'coverage/e2e',
};