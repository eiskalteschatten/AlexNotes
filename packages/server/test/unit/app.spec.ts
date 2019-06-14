import * as request from 'supertest';

import App from '../../src/app';

describe('The main app', () => {
    let app;

    beforeAll(async (done) => {
        app = await App.setupApp();
        done();
    });

    test('is set up', async () => {
        expect(app).toBeDefined();
    });

    test('Express static ("/") works', async () => {
        const response: request.Response = await request(app).get('/');
        expect(response.text).toMatch(/\<html(.*)\>/);
        expect(response.status).toEqual(200);
    });
});
