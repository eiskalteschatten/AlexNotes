'use strict';

const CronJob = require('cron').CronJob;

const cleanupDatabase = require('./cronjobs/cleanupDatabase');

module.exports = () => {
    // Daily at 4am
    new CronJob('0 4 * * * *', cleanupDatabase, null, true, 'Europe/Berlin');
};
