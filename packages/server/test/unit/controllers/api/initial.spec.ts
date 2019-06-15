import * as express from 'express';
import * as request from 'supertest';

import setupContoller, { InitialDataController } from '../../../../src/controllers/api/initial';

describe('The api/git controller', () => {
    let app: express.Application;
    let initialDataController: InitialDataController;

    beforeAll(async (done) => {
        app = express();
        initialDataController = setupContoller(express.Router());
        app.use(initialDataController.router);
        done();
    });

    test('Is set up', async () => {
        expect(initialDataController).toBeDefined();
    });

    test('"/" works via Express', async () => {
        const response: request.Response = await request(app).get('/');
        expect(response.text).toEqual('{"notebooks":[],"folders":[]}');
        expect(response.status).toEqual(200);
    });
});
