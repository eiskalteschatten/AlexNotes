import { Router, Request, Response } from 'express';

import Controller from '../../interfaces/Controller';

import { NotebookMenuItemInterface } from '../../../../shared/types/notebooks';


class NotebooksController implements Controller {
    public router: Router;

    public constructor(router: Router) {
        this.router = router;
        this.initilizeRoutes();
    }

    private initilizeRoutes(): void {
        this.router.get('/', this.getIndex);
    }

    private getIndex(req: Request, res: Response): void {
        const notebooks: NotebookMenuItemInterface[] = [
            { title: 'Notebook 2', icon: 'book', id: 'notebook2' },
            { title: 'Notebook 1', icon: 'book', id: 'notebook1' },
            { title: 'Notebook 3', icon: 'book', id: 'notebook3' }
        ];

        notebooks.sort((a, b): number => {
            if (a.title < b.title) return -1;
            if (a.title > b.title) return 1;
            return 0;
        });

        res.json(notebooks);
    }
}

export default (router: Router): void => {
    new NotebooksController(router);
};
