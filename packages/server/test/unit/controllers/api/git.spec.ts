import * as express from 'express';
import * as request from 'supertest';

import setupGitContoller, { GitController } from '../../../../src/controllers/api/git';

describe('The api/git controller', () => {
    let app: express.Application;
    let gitController: GitController;

    beforeAll(async (done) => {
        app = express();
        gitController = setupGitContoller(express.Router());
        done();
    });

    test('Is set up', async () => {
        expect(gitController).toBeDefined();
    });

    test('"/api/pull" works via Express', async () => {
        const response: request.Response = await request(app).get('/api/pull');
        // Expect 404 because there is nothing in the test system to pull
        expect(response.status).toEqual(404);
    });
});
