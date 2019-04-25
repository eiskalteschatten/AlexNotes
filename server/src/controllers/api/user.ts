import { Router, Request, Response } from 'express';

import { UserUpdateModel } from '../../models/user';
import UserService from '../../services/user';

import HttpError from '../../errors/HttpError';
import { returnError } from '../../lib/apiErrorHandling';

import Controller from '../../interfaces/Controller';


class UserController implements Controller {
    public router: Router;

    public constructor(router: Router) {
        this.router = router;
        this.initilizeRoutes();
    }

    private initilizeRoutes(): void {
        this.router.put('/edit', this.putEdit);
        this.router.put('/change-password', this.putChangePassword);
    }

    private async putEdit(req: Request, res: Response): Promise<void> {
        const body = req.body;
        const values: UserUpdateModel = {
            id: req.user.id,
            firstName: body.firstName,
            lastName: body.lastName,
            emailAddress: body.emailAddress
        };

        try {
            const userService: UserService = new UserService();
            await userService.updateUser(values);
            res.status(201).send('');
        }
        catch(error) {
            console.error(error);
            res.status(500).send('');
        }
    }

    private async putChangePassword(req: Request, res: Response): Promise<void> {
        const body = req.body;

        if (body.password !== body.confirmPassword) {
            res.status(412).send('passwordsDoNotMatch');
            return;
        }

        try {
            const userService: UserService = new UserService();
            await userService.updatePassword(req.user.id, body.currentPassword, body.password);
            res.status(201).send('');
        }
        catch(error) {
            returnError(<HttpError>error, req, res);
        }
    }
}

export default (router: Router): void => {
    new UserController(router);
};

