import { Request, Response } from 'express';

import HttpError from '../errors/HttpError';


export function returnError(error: HttpError, req: Request, res: Response): void {
    if (error.status) {
        res.status(error.status).send(error.message);
    }
    else {
        console.error(error);
        res.status(500).send('anErrorOccurred');
    }
}
