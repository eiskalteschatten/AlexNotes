'use strict';

const isTestEnv = process.env.NODE_ENV === 'test';
const Sequelize = isTestEnv ? require('sequelize-mock') : require('sequelize');
const config = require('config');
const dbConfig = config.get('database');

let sequelize;

if (isTestEnv) {
    sequelize = new Sequelize();
}
else {
    sequelize = new Sequelize(dbConfig.dbName, dbConfig.username, dbConfig.password, {
        dialect: 'postgres',
        host: dbConfig.host,
        port: dbConfig.port
    });
}

module.exports = {
    db: sequelize,
    setupSequelize: async () => {
        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
        }
        catch(error) {
            console.error('Unable to connect to the database:', error);
        }

        return sequelize;
    }
};
