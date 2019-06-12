module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coveragePathIgnorePatterns: ['/node_modules/', '/config/test.js', '/dist/'],
    testPathIgnorePatterns: ['/node_modules/', '/config/test.js', '/dist/'],
    collectCoverage: true,
    coverageDirectory: './test-coverage'
};
