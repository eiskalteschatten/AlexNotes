import { Request } from 'express';
import * as config from 'config';
import * as passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy} from 'passport-local';

import { DefaultUserInterface } from '../../interfaces/Config';

import User from '../../models/User';


const localConfig = {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
};

const jwtConfig = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.get('jwt.secret')
};

export default (): void => {
    passport.use('local-login', new LocalStrategy(localConfig, (req: Request, username: string, password: string, done: Function): void => {
        process.nextTick(async (): Promise<void> => {
            try {
                const user = await User.findOne({
                    where: {
                        username,
                        roles: { $contains: ['user'] }
                    }
                });

                if (!user || !user.validPassword(password) || user.roles.includes('inactive')) {
                    return done(null, false);
                }

                return done(null, user);
            }
            catch(error) {
                console.error(error);
                done(error);
            }
        });
    }));

    passport.use('jwt', new JwtStrategy(jwtConfig, async (jwtPayload: any, done: Function): Promise<void> => {
        try {
            const user = await User.findById(jwtPayload.id);

            if (!user) {
                return done(null, false);
            }

            return done(null, user);
        }
        catch(error) {
            console.error(error);
            done(error);
        }
    }));

    passport.serializeUser((user, done: Function): void => {
        done(null, user.id);
    });

    passport.deserializeUser((id: string | number, done: Function): void => {
        User.findById(id).then((user): void => {
            done(null, user);
        }).catch((error): void => {
            console.error(error);
        });
    });

    if (process.env.SETUP_DEFAULT_USER) {
        const defaultUser: DefaultUserInterface = config.get('defaultUser');

        User.findOne({ where: { username: defaultUser.username } } ).then((user): void => {
            if (user) {
                console.error('You are trying to create a new default user, but one has already been setup!');
                return;
            }

            const password: string = User.generateHash(defaultUser.password);

            return User.create({
                firstName: defaultUser.firstName,
                lastName: defaultUser.lastName,
                username: defaultUser.username,
                emailAddress: defaultUser.emailAddress,
                password
            });
        }).then((user): void => {
            if (user) {
                console.log('Created new default user:', defaultUser);
            }
        }).catch(console.error);
    }
};
