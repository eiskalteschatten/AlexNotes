import{ CronJob } from 'cron';
import * as config from 'config';

import Git from './lib/git';

import { GitPullPushCronjobInterface } from './interfaces/Config';

// import cleanupDatabase from './cronjobs/cleanupDatabase';

async function gitPullPush(): Promise<void> {
    const git = new Git();
    await git.cronjob();
}

export default (): void => {
    // Database cronjobs
    // Daily at 4am
    // new CronJob('0 4 * * * *', cleanupDatabase, null, true, 'Europe/Berlin');

    // Git cronjobs
    const pullPush: GitPullPushCronjobInterface = config.get('git.pullPushCronjob');
    new CronJob(pullPush.time, gitPullPush, null, true, pullPush.timezone);
};
