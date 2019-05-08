import * as config from 'config';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import * as fs from 'fs';

export function createFolderInRepo(pathToFolder: string): Promise<string> {
    return new Promise((resolve, reject): void => {
        const fullPath: string = path.resolve(config.get('git.localPath'), pathToFolder);

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
