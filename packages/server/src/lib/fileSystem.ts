import * as config from 'config';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import * as fs from 'fs';
import * as rimraf from 'rimraf';

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
