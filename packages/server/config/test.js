'use strict';

const path = require('path');
const tmpdir = require('os').tmpdir();

const timestamp = Math.round(new Date().getTime() / 1000).toString();
const repoPath = path.resolve(tmpdir, 'alexnotes', 'repo', timestamp);

module.exports = {
    defaultUser: {
        firstName: 'New',
        lastName: 'User',
        username: 'admin',
        password: 'admin',
        emailAddress: ''
    },
    database: {
        storage: path.resolve(tmpdir, 'alexnotes', 'test.sqlite3')
    },
    git: {
        url: repoPath,
        branch: 'master',
        auth: {
            type: 'local'
        },
        localPath: repoPath,
        pullPushCronjob: {
            time: '*/15 * * * *', // every 15 minutes
            timezone: 'Europe/Berlin'
        }
    }
};
