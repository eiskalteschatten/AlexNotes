import { Router, Request, Response } from 'express';
import * as slug from 'slug';
import * as config from 'config';
import * as path from 'path';

import Git from '../../lib/git';
import { returnError } from '../../lib/apiErrorHandling';

import {
    createFolderInRepo,
    writeMetaDataJsonFile,
    readFolderMetadata,
    readFolder,
    deleteFolderFromRepo,
    renameFolderInRepo
} from '../../lib/fileSystem';

import { FolderMenuItemInterface, FolderMetaDataInterface } from '../../../../shared/types/folders';
import Controller from '../../interfaces/Controller';


class FoldersController implements Controller {
    public router: Router;

    public constructor(router: Router) {
        this.router = router;
        this.initilizeRoutes();
    }

    private initilizeRoutes(): void {
        this.router.get('/', this.getIndex);
        this.router.put('/', this.putFolder);
        this.router.patch('/rename', this.patchRenameFolder);
        this.router.delete('/:id', this.deleteFolder);
    }

    private async getIndex(req: Request, res: Response): Promise<void> {
        try {
            const notebookId: string = req.query.notebookId;

            if (!notebookId) {
                res.status(400).send('No notebook was selected');
                return;
            }

            const pathToFolders: string = path.resolve(config.get('git.localPath'), config.get('notes.folder'), notebookId);
            const folderMenuItems: FolderMenuItemInterface[] = await readFolder(pathToFolders);

            folderMenuItems.sort((a, b): number => {
                if (a.title < b.title) return -1;
                if (a.title > b.title) return 1;
                return 0;
            });

            res.json(folderMenuItems);
        }
        catch(error) {
            returnError(error, req, res);
        }
    }

    private async putFolder(req: Request, res: Response): Promise<void> {
        try {
            const { title, parent } = req.body;
            const id: string = parent + '/' + slug(title.toLowerCase());

            const metadata: FolderMetaDataInterface = { title, id, parent };
            const fullPath: string = path.join(config.get('notes.folder'), id);

            await createFolderInRepo(fullPath);
            await writeMetaDataJsonFile(fullPath, JSON.stringify(metadata));

            const git = new Git();
            git.addCommitPullPush(`Added or updated the folder "${title}"`);

            res.status(200).json(metadata);
        }
        catch(error) {
            returnError(error, req, res);
        }
    }

    private async patchRenameFolder(req: Request, res: Response): Promise<void> {
        try {
            const oldId: string = req.body.id;
            const title: string = req.body.newName;

            const oldFullPath: string = path.join(config.get('notes.folder'), oldId);
            const pathToFolder: string = path.resolve(config.get('git.localPath'), oldFullPath);
            const metadataString: string = await readFolderMetadata(pathToFolder);
            const oldMetadata: FolderMetaDataInterface = JSON.parse(metadataString);
            const parent: string = oldMetadata.parent;

            const newId: string = parent + '/' + slug(title.toLowerCase());
            const metadata: FolderMetaDataInterface = { title, id: newId, parent };

            const newFullPath: string = path.join(config.get('notes.folder'), newId);

            await renameFolderInRepo(oldFullPath, newFullPath);
            await writeMetaDataJsonFile(newFullPath, JSON.stringify(metadata));

            const git = new Git();
            git.addCommitPullPush(`Renamed a folder to "${title}"`);

            res.status(200).json(metadata);
        }
        catch(error) {
            returnError(error, req, res);
        }
    }

    private async deleteFolder(req: Request, res: Response): Promise<void> {
        try {
            const id: string = decodeURIComponent(req.params.id);
            const fullPath: string = path.join(config.get('notes.folder'), id);

            await deleteFolderFromRepo(fullPath);

            const git = new Git();
            git.addCommitPullPush(`Deleted the folder with id "${id}"`);

            res.status(204).send('');
        }
        catch(error) {
            returnError(error, req, res);
        }
    }
}

export default (router: Router): void => {
    new FoldersController(router);
};
