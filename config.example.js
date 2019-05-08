'use strict';

const path = require('path');
const homedir = require('os').homedir();

module.exports = {
    defaultUser: {
        firstName: 'New',
        lastName: 'User',
        username: 'admin',
        password: 'admin',
        emailAddress: ''
    },
    git: {
        url: '',
        branch: 'master',
        auth: {
            type: '',
            username: '',
            password: ''
        },
        localPath: path.resolve(homedir, '.alexnotes', 'repo')
    }
};
