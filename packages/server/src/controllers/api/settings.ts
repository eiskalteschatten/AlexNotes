import { Router, Request, Response } from 'express';

import { returnError } from '../../lib/apiErrorHandling';

import Controller from '../../interfaces/Controller';


export class SettingsController implements Controller {
    public router: Router;

    public constructor(router: Router) {
        this.router = router;
        this.initilizeRoutes();
    }

    private initilizeRoutes(): void {
        this.router.get('/', this.getIndex);
        this.router.put('/', this.putIndex);
    }

    private getIndex(req: Request, res: Response): void {
        res.json({});
    }

    private putIndex(req: Request, res: Response): void {
        try {
            res.status(201).send('');
        }
        catch(error) {
            returnError(error, req, res);
        }
    }
}

export default (router: Router): SettingsController => {
    return new SettingsController(router);
};
