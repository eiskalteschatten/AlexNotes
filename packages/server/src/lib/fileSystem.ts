import * as config from 'config';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import * as fs from 'fs';
import * as rimraf from 'rimraf';

import { FolderMenuItemInterface, FolderMetaDataInterface } from '../../../shared/types/folders';

import HttpError from '../errors/HttpError';

export function createFolderInRepo(pathToFolder: string): Promise<string|HttpError> {
    return new Promise((resolve, reject): void => {
        const fullPath: string = path.resolve(config.get('git.localPath'), pathToFolder);

        if (fs.existsSync(fullPath)) {
            const httpError = new HttpError('theFolderAlreadyExists', 409);
            reject(httpError);
        }

        mkdirp(fullPath, (error: Error): void => {
            if (error) {
                reject(error);
            }

            resolve(fullPath);
        });
    });
}

export function writeMetaDataJsonFile(pathToFolder: string, metadata: string): Promise<string> {
    return new Promise((resolve, reject): void => {
        const fullPath: string = path.resolve(config.get('git.localPath'), pathToFolder, 'metadata.json');

        fs.writeFile(fullPath, metadata, 'utf8', (error: Error): void => {
            if (error) {
                reject(error);
            }

            resolve(fullPath);
        });
    });
}

export function writeMarkdownAndJsonFiles(pathToFolder: string, fileName: string, content: string, metadata: string): Promise<void> {
    return new Promise((resolve, reject): void => {
        const localPathToFolder: string = path.join(config.get('git.localPath'), pathToFolder);
        const fullPathMarkdown: string = path.resolve(localPathToFolder, `${fileName}.md`);

        fs.writeFile(fullPathMarkdown, content, 'utf8', (error: Error): void => {
            if (error) {
                reject(error);
            }

            const fullPathMetadataJson: string = path.resolve(localPathToFolder, `metadata-${fileName}.json`);

            fs.writeFile(fullPathMetadataJson, metadata, 'utf8', (error: Error): void => {
                if (error) {
                    reject(error);
                }

                resolve();
            });
        });
    });
}

export function deleteMarkdownAndJsonFile(pathToFolder: string, fileName: string): Promise<void> {
    return new Promise((resolve, reject): void => {
        const localPathToFolder: string = path.join(config.get('git.localPath'), pathToFolder);
        const fullPathMarkdown: string = path.resolve(localPathToFolder, `${fileName}.md`);
        const fullPathMetadataJson: string = path.resolve(localPathToFolder, `metadata-${fileName}.json`);

        fs.unlink(fullPathMarkdown, (error: Error): void => {
            if (error) {
                reject(error);
            }

            fs.unlink(fullPathMetadataJson, (error: Error): void => {
                if (error) {
                    reject(error);
                }

                resolve();
            });
        });
    });
}

export function readFile(pathToFile: string): Promise<string> {
    return new Promise((resolve, reject): void => {
        fs.readFile(pathToFile, 'utf8', (error: Error, data: string): void => {
            if (error) {
                reject(error);
            }

            resolve(data);
        });
    });
}

export function readFolderMetadata(pathToFolder: string): Promise<string> {
    return readFile(path.resolve(pathToFolder, 'metadata.json'));
}

export async function readFolder(pathToFolders: string): Promise<FolderMenuItemInterface[]> {
    return new Promise((resolve, reject): void => {
        fs.readdir(pathToFolders, async (error: Error, folders: string[]): Promise<void> => {
            if (error) {
                reject(error);
            }

            const folderMenuItems: FolderMenuItemInterface[] = [];

            for (const folder of folders) {
                const pathToFolder: string = path.resolve(pathToFolders, folder);

                if (fs.lstatSync(pathToFolder).isDirectory()) {
                    const metadataString: string = await readFolderMetadata(pathToFolder);
                    const metadata: FolderMetaDataInterface = JSON.parse(metadataString);

                    const menuItem: FolderMenuItemInterface = {
                        title: metadata.title,
                        id: metadata.id
                    };

                    const subfolders: FolderMenuItemInterface[] = await readFolder(pathToFolder);

                    if (subfolders && subfolders.length) {
                        menuItem.subfolders = subfolders;
                    }

                    folderMenuItems.push(menuItem);
                }
            }

            resolve(folderMenuItems);
        });
    });
}

export function deleteFolderFromRepo(pathToFolder: string): Promise<string> {
    return new Promise((resolve, reject): void => {
        const fullPath: string = path.resolve(config.get('git.localPath'), pathToFolder);

        rimraf(fullPath, (error: Error): void => {
            if (error) {
                reject(error);
            }

            resolve();
        });
    });
}

export async function renameSubFoldersInRepo(pathToFolders: string, oldParentId: string, newParentId: string): Promise<string[]> {
    return new Promise((resolve, reject): void => {
        fs.readdir(pathToFolders, async (error: Error, folders: string[]): Promise<void> => {
            if (error) {
                reject(error);
            }

            for (const folder of folders) {
                const pathToFolder: string = path.resolve(pathToFolders, folder);

                if (fs.lstatSync(pathToFolder).isDirectory()) {
                    const metadataString: string = await readFolderMetadata(pathToFolder);
                    const metadata: FolderMetaDataInterface = JSON.parse(metadataString);

                    metadata.parent = newParentId;
                    metadata.id = metadata.id.replace(oldParentId, newParentId);

                    try {
                        await writeMetaDataJsonFile(pathToFolder, JSON.stringify(metadata));
                        await renameSubFoldersInRepo(pathToFolder, oldParentId, newParentId);
                    }
                    catch(error) {
                        reject(error);
                    }
                }
            }

            resolve(folders);
        });
    });
}

export function renameFolderInRepo(oldPathToFolder: string, newPathToFolder: string, oldParentId: string, newParentId: string): Promise<string> {
    return new Promise((resolve, reject): void => {
        const oldFullPath: string = path.resolve(config.get('git.localPath'), oldPathToFolder);
        const newFullPath: string = path.resolve(config.get('git.localPath'), newPathToFolder);

        if (fs.existsSync(newFullPath)) {
            const httpError = new HttpError('theFolderAlreadyExists', 409);
            reject(httpError);
        }

        fs.rename(oldFullPath, newFullPath, async (error: Error): Promise<void> => {
            if (error) {
                reject(error);
            }

            await renameSubFoldersInRepo(newFullPath, oldParentId, newParentId);

            resolve();
        });
    });
}
