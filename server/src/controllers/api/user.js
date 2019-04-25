'use strict';

const User = require('../../models/User');


module.exports = router => {
    router.put('/edit', async (req, res) => {
        const body = req.body;
        const values = {
            firstName: body.firstName,
            lastName: body.lastName,
            emailAddress: body.emailAddress
        };

        try {
            await User.update(values, { where: { id: req.user.id }});
            res.status(201).send('');
        }
        catch(error) {
            console.error(new Error(error));
            res.status(500).send('');
        }
    });

    router.put('/change-password', async (req, res) => {
        const body = req.body;

        if (body.password === body.confirmPassword) {
            try {
                const user = await User.findById(req.user.id);

                if (!user.validPassword(body.currentPassword)) {
                    return res.status(412).send('oldPasswordIncorrect');
                }

                user.password = User.generateHash(body.password);

                await user.save();

                res.status(201).send('');
            }
            catch(error) {
                console.error(new Error(error));
                res.status(500).send('');
            }
        }
        else {
            res.status(412).send('passwordsDoNotMatch');
        }
    });
};
