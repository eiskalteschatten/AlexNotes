import * as express from 'express';

import HttpError from '../../../src/errors/HttpError';
import { returnError } from '../../../src/lib/apiErrorHandling';

import { mockRequest, mockResponse } from '../../mocks/express';


describe('apiErrorHandling lib', () => {
    let app: express.Application;
    const req = mockRequest();
    const res = mockResponse();

    beforeAll(async (done) => {
        app = express();
        done();
    });

    test('Return error with default status', async () => {
        const httpError: HttpError = new HttpError('Test 404 error');
        returnError(httpError, req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith(httpError.message);
    });

    test('Return error with status 500', async () => {
        const httpError: HttpError = new HttpError('Test 500 error', 500);
        returnError(httpError, req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith(httpError.message);
    });
});
