'use strict';

class ApiControllerFactory {
    constructor(Model) {
        this.Model = Model;
    }

    async getAll(req, res) {
        try {
            const results = this.Model.getAllFrontendWithRelated
                ? await this.Model.getAllFrontendWithRelated(req.user.id)
                : await this.Model.findAll({ where: { userId: req.user.id } });

            res.json(results);
        }
        catch(error) {
            console.error(new Error(error));
            res.status(500).send('');
        }
    }

    async getSingle(req, res) {
        try {
            const result = this.Model.getSingleFrontendWithRelated
                ? await this.Model.getSingleFrontendWithRelated(req.params.id, req.user.id)
                : this.Model.findOne({ where: { id: req.params.id, userId: req.user.id } });

            res.json(result.frontendValues);
        }
        catch(error) {
            console.error(new Error(error));
            res.status(500).send('');
        }
    }

    async delete(req, res) {
        try {
            await this.Model.destroy({ where: { id: req.params.id, userId: req.user.id } });
            res.status(201).send('');
        }
        catch(error) {
            console.error(new Error(error));
            res.status(500).send('');
        }
    }
}

module.exports = ApiControllerFactory;
