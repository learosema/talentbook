module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '\\.(css|less|scss)$': './jest/stub-transformer.js'
  }
};
