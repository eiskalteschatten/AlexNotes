'use strict';

const express = require('express');
const enrouten = require('express-enrouten');

// const path = require('path');
const compression = require('compression');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// const migrateDb = require('sequelize-migration-wrapper');

const {setupSequelize} = require('./lib/db');

const passport = require('passport');

const config = require('config');
const translations = config.get('translations');

const configureFrontend = require('./lib/configureFrontend');
const setupErrorHandling = require('./lib/errorHandling');

const setupPassport = require('./lib/authentication/setupPassport');
const setupCronjobs = require('./cronjobs');


module.exports = async () => {
    let app = express();
    await setupSequelize();
    // const sequelize = await setupSequelize();

    // Run database migration scripts
    // migrateDb({
    //     sequelize,
    //     path: path.join(__dirname, 'migrations')
    // });

    // await migrateDb.migrate();


    // Express setup
    app.use(logger('dev'));
    app.use(compression());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.disable('x-powered-by');


    // Setup Passport authentication
    app.use(passport.initialize());
    setupPassport();

    app.use(/^((?!\/$|login|status|dist|images|favicon).)*$/, passport.authenticate('jwt', { session: false }), (req, res, next) => {
        return next();
    });


    // Add the user's preferred language to the request
    app.use((req, res, next) => {
        const preferedLanguage = req.cookies.preferedLanguage;
        let language;

        if (preferedLanguage) {
            language = preferedLanguage;
        }
        else {
            language = req.headers['accept-language'] || 'en';

            if (language.indexOf(',') > -1) {
                language = language.split(',')[0];
            }

            if (language.indexOf('-') > -1) {
                language = language.split('-')[0];
            }
        }

        req.preferedLanguage = translations.includes(language) ? language : 'en';
        next();
    });


    // Setup frontend
    const frontendPath = await configureFrontend();
    app.use(express.static(frontendPath));


    // Setup routes
    // app = proxies(express, app);
    app.use(enrouten({
        directory: 'controllers'
    }));


    // Error handlers
    app = setupErrorHandling(app);


    console.log('App started with:');
    console.log('- Node.js', process.version);
    console.log(`- Started with NODE_ENV=${app.get('env')}`);

    setupCronjobs();

    return app;
};
