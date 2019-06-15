import { Router, Request, Response } from 'express';

import Controller from '../../interfaces/Controller';


export class InitialDataController implements Controller {
    public router: Router;

    public constructor(router: Router) {
        this.router = router;
        this.initilizeRoutes();
    }

    private initilizeRoutes(): void {
        this.router.get('/', this.getIndex);
    }

    private getIndex(req: Request, res: Response): void {
        res.json({
            notebooks: [],
            folders: []
        });
    }
}

export default (router: Router): InitialDataController => {
    return new InitialDataController(router);
};
