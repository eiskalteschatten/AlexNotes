import * as express from 'express';
import * as request from 'supertest';

import setupContoller, { GitController } from '../../../../src/controllers/api/git';
import Git from '../../../../src/lib/git';

describe('The api/git controller', () => {
    let app: express.Application;
    let gitController: GitController;
    let git: Git;

    beforeAll(async (done) => {
        app = express();
        gitController = setupContoller(express.Router());
        app.use(gitController.router);
        git = new Git();
        await git.initialize();
        done();
    });

    test('Is set up', async () => {
        expect(gitController).toBeDefined();
    });

    test('"/pull" works via Express', async () => {
        const response: request.Response = await request(app).get('/pull');
        // Expect 404 because there is nothing in the test system to pull
        expect(response.status).toEqual(404);
    });
});
