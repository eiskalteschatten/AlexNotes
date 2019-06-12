import mainApp from '../../src/app';

describe('The main app', () => {
    test('exists', () => {
        expect(mainApp).toBe(expect.anything());
    });

    test('is set up', () => {
        expect(mainApp.setupApp()).resolves;
    });
});
