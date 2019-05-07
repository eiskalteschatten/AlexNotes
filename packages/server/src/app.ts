import * as express from 'express';
import * as enrouten from 'express-enrouten';
import * as config from 'config';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';

import frontendPath from 'alexnotes-frontend';

import configureProxies from './lib/booting/proxies';
import { setupSequelize } from './lib/db';
import setupPassport from './lib/authentication/setupPassport';
import setupCronjobs from './cronjobs';
import Git from './lib/git';

class App {
    public app: express.Application;

    public constructor() {
        this.app = express();
    }

    public async setupApp(): Promise<express.Application> {
        this.configureExpress();
        await this.configureDatabase();
        this.configurePassport();
        this.addPreferredLanguage();
        await this.configureRoutes();
        setupCronjobs();

        const git = new Git();
        await git.initialize();

        console.log('App started with:');
        console.log('- Node.js', process.version);
        console.log(`- Started with NODE_ENV=${process.env.NODE_ENV}`);

        return this.app;
    }

    private configureExpress(): void {
        this.app.use(compression());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cookieParser());
        this.app.disable('x-powered-by');
    }

    private async configureDatabase(): Promise<void> {
        setupSequelize();
        // const sequelize = await setupSequelize();

        // Run database migration scripts
        // migrateDb({
        //     sequelize,
        //     path: path.join(__dirname, 'migrations')
        // });

        // await migrateDb.migrate();
    }

    private configurePassport(): void {
        this.app.use(passport.initialize());
        setupPassport();

        this.app.use(
            config.get('authentication.noAuth'),
            passport.authenticate('jwt', { session: false }),
            (req: express.Request, res: express.Response, next: express.NextFunction): void => {
                return next();
            }
        );
    }

    private addPreferredLanguage(): void {
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
            const translations: string = config.get('translations');
            const preferedLanguage: string = req.cookies.preferedLanguage;
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
    }

    private async configureRoutes(): Promise<void> {
        this.app.use(express.static(frontendPath));

        configureProxies(this.app);

        this.app.use(enrouten({
            directory: 'controllers'
        }));
    }
}

export default new App();
