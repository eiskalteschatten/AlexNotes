import mainApp from '../../src/app';

describe('The main app', () => {
    test('is set up', async () => {
        const setupApp = await mainApp.setupApp();
        expect(setupApp).resolves;
    });
});
