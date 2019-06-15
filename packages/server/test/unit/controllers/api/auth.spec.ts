import * as express from 'express';
import * as request from 'supertest';

import setupContoller, { AuthController } from '../../../../src/controllers/api/auth';

describe('The api/git controller', () => {
    let app: express.Application;
    let authController: AuthController;

    beforeAll(async (done) => {
        app = express();
        authController = setupContoller(express.Router());
        app.use(authController.router);
        done();
    });

    test('Is set up', async () => {
        expect(authController).toBeDefined();
    });

    test.todo('"/login" works via Express');
    test.todo('"/validate" works via Express');

    test('"/logout" works via Express', async () => {
        const response: request.Response = await request(app).post('/logout');
        expect(response.status).toEqual(200);
    });
});
