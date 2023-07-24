module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  setupFiles: ['jest-plugin-context/setup'],
  moduleFileExtensions: ['js', 'ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/*.*Test.ts'],

  coverageDirectory: './coverage',
  collectCoverage: true,
  testResultsProcessor: 'jest-sonar-reporter',
  testURL: 'http://localhost',
};
