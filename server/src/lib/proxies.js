'use strict';

const path = require('path');

const config = require('config');
const routes = config.get('proxies');


module.exports = (express, app) => {
    for (const routePath of Object.keys(routes)) {
        const router = routes[routePath];

        if (typeof router === 'object') {
            if (router.excludeEnv && router.excludeEnv.indexOf(app.get('env')) === -1) {
                const pathToRouteScript = path.join('../../', router.router);
                app.use(routePath, express.static(pathToRouteScript));
            }
        }
        else {
            const pathToRouteScript = path.join('../../', router);
            app.use(routePath, express.static(pathToRouteScript));
        }
    }

    return app;
};
