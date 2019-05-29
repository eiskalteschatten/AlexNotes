import * as express from 'express';

import * as config from'config';
const routes: {} = config.get('proxies');


export default (app: express.Application): void => {
    for (const routePath of Object.keys(routes)) {
        const router = routes[routePath];

        if (typeof router === 'object') {
            if (router.excludeEnv && router.excludeEnv.indexOf(app.get('env')) === -1) {
                app.use(routePath, express.static(router.router));
            }
        }
        else {
            app.use(routePath, express.static(router));
        }
    }
};
