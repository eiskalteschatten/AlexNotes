import{ CronJob } from 'cron';

import cleanupDatabase from './cronjobs/cleanupDatabase';

export default (): void => {
    // Daily at 4am
    new CronJob('0 4 * * * *', cleanupDatabase, null, true, 'Europe/Berlin');
};
