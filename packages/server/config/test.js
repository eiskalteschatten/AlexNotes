'use strict';

const path = require('path');
const tmpdir = require('os').tmpdir();

const timestamp = Math.round(new Date().getTime() / 1000).toString();
const repoPath = path.resolve(tmpdir, 'alexnotes', 'repo', timestamp);

module.exports = {
    defaultUser: {
        firstName: 'Test',
        lastName: 'User',
        username: 'test',
        password: 'test',
        emailAddress: 'testing@alexseifert.com'
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
