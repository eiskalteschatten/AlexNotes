import { Application } from 'express';
import * as request from 'supertest';

import App from '../../src/app';

describe('The main app', () => {
    let app: Application;

    beforeAll(async (done) => {
        app = await App.setupApp();
        done();
    });

    test('Is set up', async () => {
        expect(app).toBeDefined();
    });

    test('Express static ("/") works', async () => {
        const response: request.Response = await request(app).get('/');
        expect(response.text).toMatch(/\<html(.*)\>/);
        expect(response.status).toEqual(200);
    });

    test('"preferedLanguage" cookie works', async () => {
        const response: request.Response = await request(app)
            .get('/')
            .set('Cookie', ['preferedLanguage=en']);

        expect(response.status).toEqual(200);
    });

    test('Default language works', async () => {
        const response: request.Response = await request(app)
            .get('/')
            .set('Cookie', ['preferedLanguage=jp']);

        expect(response.status).toEqual(200);
    });

    test('"accept-language" headers work', async () => {
        const commaResponse: request.Response = await request(app)
            .get('/')
            .set('accept-language', 'en,de');

        expect(commaResponse.status).toEqual(200);

        const dashResponse: request.Response = await request(app)
            .get('/')
            .set('accept-language', 'en-GB');

        expect(dashResponse.status).toEqual(200);
    });

    test('Test that a 401 comes if the user isn\'t logged in', async () => {
        const response: request.Response = await request(app).get('/api/initial');
        expect(response.status).toEqual(401);
    });
});
