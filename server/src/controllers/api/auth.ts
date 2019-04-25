
import { Router, Request, Response, NextFunction } from 'express';
import * as config from 'config';
import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';

import { User } from '../../models/user';
import UserService from '../../services/user';

import { returnError } from '../../lib/apiErrorHandling';

import Controller from '../../interfaces/Controller';


class AuthController implements Controller {
    public router: Router;

    public constructor(router: Router) {
        this.router = router;
        this.initilizeRoutes();
    }

    private initilizeRoutes(): void {
        this.router.post('/login', this.postLogin);
        this.router.post('/logout', this.postLogout);
        this.router.post('/validate', this.postValidate);
    }

    private postLogin(req: Request, res: Response, next: NextFunction): void {
        try {
            passport.authenticate('local-login', { session: false }, (error: Error, user: User): void => {
                if (error) {
                    console.error(error);
                    res.status(400).json({
                        message: error,
                        type: 'error',
                        user
                    });
                    return;
                }

                req.login(user, { session: false }, (error: Error): void => {
                    if (error || !user) {
                        if (error) {
                            console.error(error);
                        }

                        res.status(400).json({
                            message: error,
                            type: 'error',
                            user
                        });

                        return;
                    }

                    const userRaw = user.get();
                    const token = jwt.sign(userRaw, config.get('jwt.secret'));

                    res.json({ user: UserService.cleanUser(user), token });
                });
            })(req, res, next);
        }
        catch(error) {
            if (error != 401) {
                returnError(error, req, res);
            }
        }
    }

    private postLogout(req: Request, res: Response): void {
        req.logout();
        res.send('');
    }

    private postValidate(req: Request, res: Response): void {
        res.json({ user: UserService.cleanUser(req.user.get()) });
    }
}

export default (router: Router): void => {
    new AuthController(router);
};
