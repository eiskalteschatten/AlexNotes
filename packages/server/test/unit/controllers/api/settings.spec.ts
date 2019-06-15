import * as express from 'express';
import * as request from 'supertest';

import setupContoller, { SettingsController } from '../../../../src/controllers/api/settings';

describe('The api/git controller', () => {
    let app: express.Application;
    let settingsController: SettingsController;

    beforeAll(async (done) => {
        app = express();
        settingsController = setupContoller(express.Router());
        app.use(settingsController.router);
        done();
    });

    test('Is set up', async () => {
        expect(settingsController).toBeDefined();
    });

    test('get("/") works via Express', async () => {
        const response: request.Response = await request(app).get('/');
        expect(response.text).toEqual('{}');
        expect(response.status).toEqual(200);
    });

    test('put("/") works via Express', async () => {
        const response: request.Response = await request(app)
            .put('/')
            .send({});

        expect(response.status).toEqual(201);
    });
});
