import { Router, Request, Response } from 'express';

import { returnError } from '../../lib/apiErrorHandling';
import Git from '../../lib/git';

import Controller from '../../interfaces/Controller';


export class GitController implements Controller {
    public router: Router;

    public constructor(router: Router) {
        this.router = router;
        this.initilizeRoutes();
    }

    private initilizeRoutes(): void {
        this.router.get('/pull', this.getPull);
    }

    private async getPull(req: Request, res: Response): Promise<void> {
        try {
            const git = new Git();
            const pulled: boolean = await git.pull();

            if (!pulled) {
                res.status(404).send('');
                return;
            }

            res.status(201).send('');
        }
        catch(error) {
            returnError(error, req, res);
        }
    }
}

export default (router: Router): GitController => {
    return new GitController(router);
};
