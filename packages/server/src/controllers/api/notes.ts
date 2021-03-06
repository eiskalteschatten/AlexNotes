import { Router, Request, Response } from 'express';
import { readdir } from 'fs';
import * as slug from 'slug';
import * as config from 'config';
import * as path from 'path';

import { markdownToHtml, markdownToHtmlWithCodeHighlighting } from '../../lib/markdown';
import Git from '../../lib/git';
import { returnError } from '../../lib/apiErrorHandling';

import {
    deleteMarkdownAndJsonFile,
    writeMarkdownAndJsonFiles,
    readFile
} from '../../lib/fileSystem';

import { NoteMetaDataInterface, NoteMenuItemInterface, NoteDataInterface } from '../../../../shared/types/notes';
import Controller from '../../interfaces/Controller';


class NotesController implements Controller {
    public router: Router;

    public constructor(router: Router) {
        this.router = router;
        this.initilizeRoutes();
    }

    private initilizeRoutes(): void {
        this.router.get('/', this.getIndex);
        this.router.get('/note/', this.getNote);
        this.router.put('/', this.putNote);
        this.router.delete('/:folderId/:id/', this.deleteNote);
    }

    private getIndex(req: Request, res: Response): void {
        try {
            const folderId: string = req.query.folderId;

            if (!folderId) {
                res.status(400).send('No folder was selected');
                return;
            }

            const pathToNotes: string = path.resolve(config.get('git.localPath'), config.get('notes.folder'), folderId);

            readdir(pathToNotes, async (error: Error, notes: string[]): Promise<void> => {
                if (error) {
                    throw error;
                }

                const noteMenuItems: NoteMenuItemInterface[] = [];

                for (const note of notes) {
                    const pathToNote: string = path.resolve(pathToNotes, note);

                    if (path.extname(note) === '.md') {
                        const baseName: string = path.basename(note, '.md');
                        const pathToNoteMetaData: string = path.resolve(pathToNotes, `metadata-${baseName}.json`);
                        const metadataString: string = await readFile(pathToNoteMetaData);
                        const metadata: NoteMetaDataInterface = JSON.parse(metadataString);

                        let content: string = await readFile(pathToNote);
                        content = markdownToHtml(content);
                        let excerpt: string = content.replace(/<[^>]*>?/g, '');
                        excerpt = excerpt.substring(0, 75);

                        const menuItem: NoteMenuItemInterface = {
                            title: metadata.title,
                            id: metadata.id,
                            excerpt,
                            dateCreated: new Date(metadata.dateCreated),
                            dateUpdated: new Date(metadata.dateUpdated)
                        };

                        noteMenuItems.push(menuItem);
                    }
                }

                noteMenuItems.sort((a, b): number => {
                    if (a.dateUpdated < b.dateUpdated) return 1;
                    if (a.dateUpdated > b.dateUpdated) return -1;
                    return 0;
                });

                res.json(noteMenuItems);
            });

        }
        catch(error) {
            returnError(error, req, res);
        }
    }

    private async getNote(req: Request, res: Response): Promise<void> {
        try {
            const folderId: string = req.query.folderId;
            const noteId: string = req.query.noteId;

            if (!folderId) {
                res.status(400).send('No folder was selected');
                return;
            }

            if (!noteId) {
                res.status(400).send('No note was selected');
                return;
            }

            const pathToFolder = path.join(config.get('git.localPath'), config.get('notes.folder'), folderId);
            const pathToNote: string = path.resolve(pathToFolder, `${noteId}.md`);
            const markdown: string = await readFile(pathToNote);
            const pathToNoteMetaData: string = path.resolve(pathToFolder, `metadata-${noteId}.json`);
            const metadataString: string = await readFile(pathToNoteMetaData);
            const metadata: NoteMetaDataInterface = JSON.parse(metadataString);

            const data: NoteDataInterface = {
                title: metadata.title,
                markdown,
                html: markdownToHtmlWithCodeHighlighting(markdown)
            };

            res.json(data);

        }
        catch(error) {
            returnError(error, req, res);
        }
    }

    private async putNote(req: Request, res: Response): Promise<void> {
        try {
            const { title, content, folderId } = req.body;
            const { dateCreated } = req.body.metaData;
            const oldId = req.body.metaData.id;

            const metadata: NoteMetaDataInterface = {
                title,
                id: slug(title.toLowerCase()),
                dateCreated: dateCreated || new Date().toISOString(),
                dateUpdated: new Date().toISOString()
            };

            const fullPath: string = path.join(config.get('notes.folder'), folderId);
            await writeMarkdownAndJsonFiles(fullPath, metadata.id, content, JSON.stringify(metadata));

            if (oldId && oldId !== metadata.id) {
                await deleteMarkdownAndJsonFile(fullPath, oldId);
            }

            const git = new Git();
            git.addCommit(`Added or updated the note "${title}"`);

            res.status(200).json(metadata);
        }
        catch(error) {
            returnError(error, req, res);
        }
    }

    private async deleteNote(req: Request, res: Response): Promise<void> {
        try {
            const folderId: string = decodeURIComponent(req.params.folderId);
            const id: string = decodeURIComponent(req.params.id);
            const fullPath: string = path.join(config.get('notes.folder'), folderId);

            if (!folderId) {
                res.status(400).send('No folder was selected');
                return;
            }

            await deleteMarkdownAndJsonFile(fullPath, id);

            const git = new Git();
            git.addCommit(`Deleted the note with id "${id}"`);

            res.status(204).send('');
        }
        catch(error) {
            returnError(error, req, res);
        }
    }
}

export default (router: Router): void => {
    new NotesController(router);
};
