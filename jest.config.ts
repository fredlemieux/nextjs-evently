import { Config } from 'jest';
import nextJest from 'next/jest';

// https://nextjs.org/docs/pages/building-your-application/testing/jest#manual-setup
// use the next/jest rust compiler
const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig: Config = {
  testEnvironment: 'node',
  coverageProvider: 'v8',
  globalSetup: '<rootDir>/test/globalSetup.ts',
  globalTeardown: '<rootDir>/test/globalTeardown.ts',
  setupFilesAfterEnv: ['<rootDir>/test/setupFile.ts'],
};

export default createJestConfig(customJestConfig);
