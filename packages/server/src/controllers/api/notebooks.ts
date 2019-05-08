import { Router, Request, Response } from 'express';
import * as slug from 'slug';
import * as config from 'config';
import * as path from 'path';

import { returnError } from '../../lib/apiErrorHandling';
import { createFolderInRepo, writeMetaDataJsonFile } from '../../lib/fileSystem';

import { NotebookMenuItemInterface, NotebookMetaDataInterface } from '../../../../shared/types/notebooks';
import Controller from '../../interfaces/Controller';


class NotebooksController implements Controller {
    public router: Router;

    public constructor(router: Router) {
        this.router = router;
        this.initilizeRoutes();
    }

    private initilizeRoutes(): void {
        this.router.get('/', this.getIndex);
        this.router.put('/', this.putNotebook);
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

    private async putNotebook(req: Request, res: Response): Promise<void> {
        try {
            const title: string = req.body.name;

            const metadata: NotebookMetaDataInterface = {
                title,
                id: slug(title.toLowerCase())
            };

            const fullPath: string = path.join(config.get('notes.folder'), metadata.id);
            await createFolderInRepo(fullPath);
            await writeMetaDataJsonFile(fullPath, JSON.stringify(metadata));

            res.status(201).send('');
        }
        catch(error) {
            returnError(error, req, res);
        }
    }
}

export default (router: Router): void => {
    new NotebooksController(router);
};
