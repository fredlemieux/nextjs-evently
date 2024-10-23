import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
  roots: ['<rootDir>'],
  globalSetup: '/test/globalSetup.ts',
  globalTeardown: '/test/globalTeardown.ts',
  setupFilesAfterEnv: ['/test/setupFile.ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
};

export default jestConfig;
