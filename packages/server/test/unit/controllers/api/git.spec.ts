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

    // When testing, the pull endpoint will only ever throw a 500 error
    // because there is no remote to pull from
    test('"/pull" throws a 500 error', async () => {
        const response: request.Response = await request(app).get('/pull');
        expect(response.status).toEqual(500);
    });
});
