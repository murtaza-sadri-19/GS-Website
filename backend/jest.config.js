'use strict';

module.exports = {
  testEnvironment:  'node',
  testTimeout:      30000,
  globalSetup:      './tests/globalSetup.js',
  testSequencer:    './tests/testSequencer.js',
  testMatch:        ['**/tests/api/**/*.test.js'],
  forceExit:        true,
  verbose:          false,
};
