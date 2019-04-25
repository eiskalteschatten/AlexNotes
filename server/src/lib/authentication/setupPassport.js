'use strict';

const config = require('config');
const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const passportJwt = require('passport-jwt');
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const User = require('../../models/User');


const localConfig = {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
};

const jwtConfig = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.get('jwt.secret')
};

module.exports = () => {
    passport.use('local-login', new LocalStrategy(localConfig, (req, username, password, done) => {
        process.nextTick(async () => {
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

    passport.use('jwt', new JwtStrategy(jwtConfig, async (jwtPayload, done) => {
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

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id).then(user => {
            done(null, user);
        }).catch(error => {
            console.error(error);
        });
    });

    if (process.env.SETUP_DEFAULT_USER) {
        const config = require('config');
        const defaultUser = config.get('defaultUser');

        User.findOne({ where: { username: defaultUser.username } } ).then(user => {
            if (user) {
                console.error('You are trying to create a new default user, but one has already been setup!');
                return;
            }

            const password = User.generateHash(defaultUser.password);

            return User.create({
                firstName: defaultUser.firstName,
                lastName: defaultUser.lastName,
                username: defaultUser.username,
                emailAddress: defaultUser.emailAddress,
                password,
                roles: defaultUser.roles
            });
        }).then(user => {
            if (user) {
                console.log('Created new default user:', defaultUser);
            }
        }).catch(console.error);
    }
};
