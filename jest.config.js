module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coveragePathIgnorePatterns: ['/node_modules/', '/config/test.js'],
    testPathIgnorePatterns: ['/node_modules/', '/config/test.js'],
    collectCoverage: true,
    coverageDirectory: './test-coverage'
};
