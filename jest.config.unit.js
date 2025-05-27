const commonConfig = require('./jest.config');

module.exports = {
  ...commonConfig,
  testMatch: [
    '**/*.unit.test.{js,ts}'
  ],
  collectCoverageFrom: [
  'controllers/**/*.js',
  'models/**/*.js',
  'routes/**/*.js',
],
  coverageDirectory: 'coverage/unit'
};