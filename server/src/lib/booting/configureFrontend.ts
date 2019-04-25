import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';


export default (): Promise<string> => {
    return new Promise((resolve, reject): void => {
        const projectPath: string = path.join(__dirname, '..', '..', '..', 'frontend', 'public');
        const modulePath: string = path.join(__dirname, '..', '..', 'node_modules', 'alexnotes-frontend');
        const publicPath: string = path.join(modulePath, 'public');

        if (process.env.NODE_ENV !== 'development' || fs.existsSync(publicPath)) {
            return resolve(publicPath);
        }

        mkdirp(modulePath, (error: Error): void => {
            if (error) {
                console.error(error);
                return reject(error);
            }

            fs.symlink(projectPath, publicPath, (error: Error): void => {
                if (error) {
                    console.error(error);
                    return reject(error);
                }

                resolve(publicPath);
            });
        });
    });
};
