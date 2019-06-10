import{ CronJob } from 'cron';
import * as config from 'config';

import Git from './lib/git';

import { GitPullPushCronjobInterface } from './interfaces/Config';

// import cleanupDatabase from './cronjobs/cleanupDatabase';

async function gitPullPush() {
    try {
        console.log('Starting scheduled git pull and push.');
        const git = new Git();
        await git.pull();
        await git.push();
        console.log('Scheduled git pull and push finished successfully.');
    }
    catch(error) {
        console.error(error);
        console.error('Scheduled git pull and push finished with an error.');
    }
}

export default (): void => {
    // Database cronjobs
    // Daily at 4am
    // new CronJob('0 4 * * * *', cleanupDatabase, null, true, 'Europe/Berlin');

    // Git cronjobs
    const pullPush: GitPullPushCronjobInterface = config.get('git.pullPushCronjob');
    new CronJob(pullPush.time, gitPullPush, null, true, pullPush.timezone);
};
