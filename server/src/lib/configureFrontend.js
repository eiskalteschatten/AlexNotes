'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');


module.exports = () => {
    return new Promise((resolve, reject) => {
        const projectPath = path.join(__dirname, '..', '..', '..', 'frontend', 'public');
        const modulePath = path.join(__dirname, '..', '..', 'node_modules', 'alexnotes-frontend');
        const publicPath = path.join(modulePath, 'public');

        if (process.env.NODE_ENV !== 'development' || fs.existsSync(publicPath)) {
            return resolve(publicPath);
        }

        mkdirp(modulePath, error => {
            if (error) {
                console.error(error);
                return reject(error);
            }

            fs.symlink(projectPath, publicPath, error => {
                if (error) {
                    console.error(error);
                    return reject(error);
                }

                resolve(publicPath);
            });
        });
    });
};
