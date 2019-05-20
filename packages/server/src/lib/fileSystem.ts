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

export function readFolderMetadata(pathToFolder: string): Promise<string> {
    return new Promise((resolve, reject): void => {
        const pathToMetadataJson: string = path.resolve(pathToFolder, 'metadata.json');

        fs.readFile(pathToMetadataJson, 'utf8', (error: Error, data: string): void => {
            if (error) {
                reject(error);
            }

            resolve(data);
        });
    });
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

            folderMenuItems.sort((a, b): number => {
                if (a.title < b.title) return -1;
                if (a.title > b.title) return 1;
                return 0;
            });

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

export function renameFolderInRepo(oldPathToFolder: string, newPathToFolder: string): Promise<string> {
    return new Promise((resolve, reject): void => {
        const oldFullPath: string = path.resolve(config.get('git.localPath'), oldPathToFolder);
        const newFullPath: string = path.resolve(config.get('git.localPath'), newPathToFolder);

        if (fs.existsSync(newFullPath)) {
            const httpError = new HttpError('theFolderAlreadyExists', 409);
            reject(httpError);
        }

        fs.rename(oldFullPath, newFullPath, (error: Error): void => {
            if (error) {
                reject(error);
            }

            resolve();
        });
    });
}
