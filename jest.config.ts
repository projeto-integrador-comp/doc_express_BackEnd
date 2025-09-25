export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],

  // setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  // moduleFileExtensions: ["ts", "js", "json"],
  // transform: {
  //   "^.+\\.ts$": "ts-jest",
  // },
  testTimeout: 30000
};
