'use strict';

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
            type: 'ssh'
        },
        localPath: '',
        pullPushCronjob: {
            time: '*/15 * * * *', // every 15 minutes
            timezone: 'Europe/Berlin'
        }
    }
};
