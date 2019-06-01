import { Router, Request, Response } from 'express';
// import { readdir, lstatSync } from 'fs';
// import * as slug from 'slug';
// import * as config from 'config';
// import * as path from 'path';

// import Git from '../../lib/git';
import { returnError } from '../../lib/apiErrorHandling';

// import {
//     createFolderInRepo,
//     writeMetaDataJsonFile,
//     readFolderMetadata,
//     deleteFolderFromRepo,
//     renameFolderInRepo
// } from '../../lib/fileSystem';

import { NoteMetaDataInterface } from '../../../../shared/types/notes';
import Controller from '../../interfaces/Controller';


class NotesController implements Controller {
    public router: Router;

    public constructor(router: Router) {
        this.router = router;
        this.initilizeRoutes();
    }

    private initilizeRoutes(): void {
        this.router.get('/', this.getIndex);
        // this.router.put('/', this.putNote);
        // this.router.patch('/rename', this.patchRenameNote);
        // this.router.delete('/:id', this.deleteNote);
    }

    private getIndex(req: Request, res: Response): void {
        try {
            const folderId: string = req.query.folderId;

            if (!folderId) {
                res.status(400).send('No folder was selected');
                return;
            }

            const tempNotes: NoteMetaDataInterface[] = [
                {
                    title: 'test note',
                    id: 'test-note',
                    content: 'this is where the <b>entirety</b> of the HTML content will go and will usually be quite a large string',
                    dateCreated: new Date(),
                    dateUpdated: new Date()
                },
                {
                    title: 'test note2',
                    id: 'test-note2',
                    content: 'another note here. this is where the <b>entirety</b> of the HTML content will go and will usually be quite a large string',
                    dateCreated: new Date(),
                    dateUpdated: new Date()
                }
            ];

            res.json(tempNotes);
            // const pathToNotebooks: string = path.resolve(config.get('git.localPath'), config.get('notes.folder'));

            // readdir(pathToNotebooks, async (error: Error, notebooks: string[]): Promise<void> => {
            //     if (error) {
            //         throw error;
            //     }

            //     const notebookMenuItems: NotebookMenuItemInterface[] = [];

            //     for (const notebook of notebooks) {
            //         const pathToNotebook: string = path.resolve(pathToNotebooks, notebook);

            //         if (lstatSync(pathToNotebook).isDirectory()) {
            //             const metadataString: string = await readFolderMetadata(pathToNotebook);
            //             const metadata: NotebookMetaDataInterface = JSON.parse(metadataString);

            //             const menuItem: NotebookMenuItemInterface = {
            //                 title: metadata.title,
            //                 icon: 'book',
            //                 id: notebook
            //             };

            //             notebookMenuItems.push(menuItem);
            //         }
            //     }

            //     notebookMenuItems.sort((a, b): number => {
            //         if (a.title < b.title) return -1;
            //         if (a.title > b.title) return 1;
            //         return 0;
            //     });

            //     res.json(notebookMenuItems);
            // });

        }
        catch(error) {
            returnError(error, req, res);
        }
    }

    // private async putNote(req: Request, res: Response): Promise<void> {
    //     try {
    //         const title: string = req.body.title;

    //         const metadata: NotebookMetaDataInterface = {
    //             title,
    //             id: slug(title.toLowerCase())
    //         };

    //         const fullPath: string = path.join(config.get('notes.folder'), metadata.id);
    //         await createFolderInRepo(fullPath);
    //         await writeMetaDataJsonFile(fullPath, JSON.stringify(metadata));

    //         const git = new Git();
    //         git.addCommitPullPush(`Added or updated the notebook "${title}"`);

    //         res.status(200).json(metadata);
    //     }
    //     catch(error) {
    //         returnError(error, req, res);
    //     }
    // }

    // private async patchRenameNote(req: Request, res: Response): Promise<void> {
    //     try {
    //         const oldId: string = req.body.id;
    //         const title: string = req.body.newName;

    //         const metadata: NotebookMetaDataInterface = {
    //             title,
    //             id: slug(title.toLowerCase())
    //         };

    //         const oldFullPath: string = path.join(config.get('notes.folder'), oldId);
    //         const newFullPath: string = path.join(config.get('notes.folder'), metadata.id);

    //         await renameFolderInRepo(oldFullPath, newFullPath, oldId, metadata.id);
    //         await writeMetaDataJsonFile(newFullPath, JSON.stringify(metadata));

    //         const git = new Git();
    //         git.addCommitPullPush(`Renamed a notebook to "${title}"`);

    //         res.status(200).json(metadata);
    //     }
    //     catch(error) {
    //         returnError(error, req, res);
    //     }
    // }

    // private async deleteNote(req: Request, res: Response): Promise<void> {
    //     try {
    //         const id: string = decodeURIComponent(req.params.id);
    //         const fullPath: string = path.join(config.get('notes.folder'), id);

    //         await deleteFolderFromRepo(fullPath);

    //         const git = new Git();
    //         git.addCommitPullPush(`Deleted the notebook with id "${id}"`);

    //         res.status(204).send('');
    //     }
    //     catch(error) {
    //         returnError(error, req, res);
    //     }
    // }
}

export default (router: Router): void => {
    new NotesController(router);
};
