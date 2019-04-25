import { Sequelize } from 'sequelize';
import * as sequelizeMock from 'sequelize-mock';
import * as config from 'config';

const isTestEnv: boolean = process.env.NODE_ENV === 'test';

import { DatabaseConfigInterface } from '../interfaces/Config';
const dbConfig: DatabaseConfigInterface = config.get('database');


let db: Sequelize;

if (isTestEnv) {
    db = new sequelizeMock();
}
else {
    db = new Sequelize(dbConfig.name, null, null, {
        dialect: 'sqlite',
        storage: dbConfig.storage
    });
}

export default db;

export async function setupSequelize (): Promise<Sequelize> {
    try {
        await db.authenticate();
        console.log('Connection to the database has been established successfully.');
    }
    catch(error) {
        console.error('Unable to connect to the database:', error);
    }

    return db;
}
