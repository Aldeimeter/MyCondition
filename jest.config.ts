// jest.config.ts
import type { JestConfigWithTsJest } from "ts-jest";
import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

const config: JestConfigWithTsJest = {
  preset: "ts-jest", // Use ts-jest preset
  testEnvironment: "node", // Environment for testing
  transform: {
    "^.+\\.tsx?$": "ts-jest", // Transform TypeScript files
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: "<rootDir>/",
  }),
  transformIgnorePatterns: [
    "/node_modules/", // Ignore transforming node_modules
  ],
};

export default config;
