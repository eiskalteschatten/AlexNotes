import { Request } from 'express';
import * as config from 'config';
import * as passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy} from 'passport-local';

import { User, UserAddModel } from '../../models/user';
import UserService from '../../services/user';

const userService: UserService = new UserService();

const localConfig = {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
};

const jwtConfig = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.get('jwt.secret')
};

export default async function(): Promise<void> {
    passport.use('local-login', new LocalStrategy(localConfig, (req: Request, username: string, password: string, done: Function): void => {
        process.nextTick(async (): Promise<void> => {
            try {
                const canLogin = await userService.localLogin(username, password);

                if (!canLogin) {
                    return done(null, false);
                }

                return done(null, userService.getUser());
            }
            catch(error) {
                console.error(error);
                done(error);
            }
        });
    }));

    passport.use('jwt', new JwtStrategy(jwtConfig, async (jwtPayload: any, done: Function): Promise<void> => {
        try {
            const canLogin = await userService.jwtLogin(jwtPayload.id);

            if (!canLogin) {
                return done(null, false);
            }

            return done(null, userService.getUser());
        }
        catch(error) {
            console.error(error);
            done(error);
        }
    }));

    passport.serializeUser((user: User, done: Function): void => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id: string | number, done: Function): Promise<void> => {
        try {
            const user: User = await User.findByPk(id);
            done(null, user);
        }
        catch(error) {
            console.error(error);
        }
    });

    if (process.env.SETUP_DEFAULT_USER) {
        try {
            const defaultUser: UserAddModel = config.get('defaultUser');
            await userService.register(defaultUser);

            if (userService.getUser()) {
                console.log('Created new default user:', defaultUser);
            }
        }
        catch(error) {
            console.error(error);
        }
    }
};
