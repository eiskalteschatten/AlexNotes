import { Model, DataTypes } from 'sequelize';
import sequelize from '../lib/db';


export interface UserAddModel {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    emailAddress: string;
}

export interface UserUpdateModel {
    id: number;
    firstName: string;
    lastName: string;
    emailAddress: string;
}

export interface UserViewModel {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    emailAddress: string;
}

export class User extends Model {
    public id!: number;
    public name!: string;
    public firstName!: string;
    public lastName!: string;
    public username!: string;
    public password!: string;
    public emailAddress!: string | null;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    emailAddress: DataTypes.STRING
    },
    {
        tableName: 'users',
        modelName: 'user',
        sequelize
});

User.sync();

export default User;
