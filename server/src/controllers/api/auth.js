'use strict';

const config = require('config');
const passport = require('passport');
const jwt = require('jsonwebtoken');

function cleanUser(user) {
    delete user.password;
    delete user.createdAt;
    delete user.updatedAt;
    return user;
}

module.exports = router => {
    router.post('/login', async (req, res, next) => {
        try {
            passport.authenticate('local-login', { session: false }, (error, user) => {
                if (error) {
                    console.error(new Error(error));
                    return res.status(400).json({
                        message: error,
                        type: 'error',
                        user
                    });
                }

                req.login(user, { session: false }, error => {
                    if (error || !user) {
                        if (error) {
                            console.error(new Error(error));
                        }

                        return res.status(400).json({
                            message: error,
                            type: 'error',
                            user
                        });
                    }

                    const userRaw = user.get();
                    const token = jwt.sign(userRaw, config.get('jwt.secret'));

                    return res.json({ user: cleanUser(userRaw), token });
                });
            })(req, res, next);
        }
        catch(error) {
            if (error != 401) {
                console.error(new Error(error));
                return res.status(500).json({
                    message: error,
                    type: 'error',
                    user
                });
            }
        }
    });

    router.post('/logout', (req, res) => {
        req.logout();
        res.send('');
    });

    router.post('/validate', (req, res) => {
        res.json({ user: cleanUser(req.user.get()) });
    });
};
