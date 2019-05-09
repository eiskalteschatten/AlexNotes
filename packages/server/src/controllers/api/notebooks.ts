import { Router, Request, Response } from 'express';
import { readdir, readFile } from 'fs';
import * as slug from 'slug';
import * as config from 'config';
import * as path from 'path';

import Git from '../../lib/git';
import { returnError } from '../../lib/apiErrorHandling';
import { createFolderInRepo, writeMetaDataJsonFile, readFolderMetadata } from '../../lib/fileSystem';

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
        try {
            const pathToNotebooks: string = path.resolve(config.get('git.localPath'), config.get('notes.folder'));

            readdir(pathToNotebooks, async (error: Error, notebooks: string[]) => {
                if (error) {
                    throw error;
                }

                const notebookMenuItems: NotebookMenuItemInterface[] = [];

                for (const notebook of notebooks) {
                    const pathToMetadataJson: string = path.resolve(pathToNotebooks, notebook);
                    const metadataString: string = await readFolderMetadata(pathToMetadataJson);
                    const metadata: NotebookMetaDataInterface = JSON.parse(metadataString);

                    const menuItem: NotebookMenuItemInterface = {
                        title: metadata.title,
                        icon: 'book',
                        id: notebook
                    };

                    notebookMenuItems.push(menuItem);
                }

                notebookMenuItems.sort((a, b): number => {
                    if (a.title < b.title) return -1;
                    if (a.title > b.title) return 1;
                    return 0;
                });

                res.json(notebookMenuItems);
            });

        }
        catch(error) {
            returnError(error, req, res);
        }
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

            const git = new Git();
            git.pullAddCommitPush(`Added or updated the notebook "${title}"`);

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
