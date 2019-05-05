import { Sequelize } from 'sequelize';
import * as config from 'config';

import { DatabaseConfigInterface } from '../interfaces/Config';
const dbConfig: DatabaseConfigInterface = config.get('database');


export const sequelize = new Sequelize(dbConfig.name, null, null, {
    dialect: 'sqlite',
    storage: dbConfig.storage
});

export default sequelize;

export async function setupSequelize (): Promise<Sequelize> {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
    }
    catch(error) {
        console.error('Unable to connect to the database:', error);
    }

    return sequelize;
}
