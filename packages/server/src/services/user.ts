import * as bcrypt from 'bcryptjs';
import * as config from 'config';

import HttpError from '../errors/HttpError';
import { User, UserAddModel, UserViewModel, UserUpdateModel } from '../models/user';

export default class UserService {
    private readonly saltRounds = 12;
    private readonly jwtSecret = config.get('jwt.secret');
    private user: User;

    public getUser(): User {
        return this.user;
    }

    public async setUser(id: number): Promise<User> {
        await this.getUserById(id);
        return this.user;
    }

    public async register({ firstName, lastName, username, password, emailAddress }: UserAddModel): Promise<UserViewModel> {
        const existingUser: User = await User.findOne({ where: { username } });

        if (existingUser) {
            throw new Error('Could not create user because a user with this username already exists!');
        }

        const hash: string = await bcrypt.hash(password, this.saltRounds);
        const userModel: User = await User.create({ firstName, lastName, username, password: hash, emailAddress });
        await this.getUserById(userModel.id);
        return this.user;
    }

    public async localLogin(username, password: string): Promise<boolean> {
        await this.getUserByUsername(username);
        const hasValidPassword: boolean = await this.validatePassword(password);
        return this.user && hasValidPassword;
    }

    public async jwtLogin(id: number): Promise<boolean> {
        await this.getUserById(id);
        return !! this.user;
    }

    public async updateUser(userModel: UserUpdateModel): Promise<void> {
        await this.getUserById(userModel.id);
        await this.user.update(userModel);
    }

    public async updatePassword(id: number, currentPassword: string, password: string): Promise<void> {
        await this.getUserById(id);
        const isValid: boolean = await this.validatePassword(currentPassword);

        if (!isValid) {
            const error: HttpError = new HttpError('oldPasswordIncorrect');
            error.status = 412;
            throw error;
        }

        this.user.password = await bcrypt.hash(password, this.saltRounds);
        await this.user.save();
    }

    public static cleanUser(user: User): UserViewModel {
        const reqUser = user;
        const cleanedUser: UserViewModel = {
            id: reqUser.id,
            firstName: reqUser.firstName,
            lastName: reqUser.lastName,
            username: reqUser.username,
            emailAddress: reqUser.emailAddress
        };
        return cleanedUser;
    }

    private async validatePassword(password: string): Promise<boolean> {
        const isValid: boolean = await bcrypt.compare(password, this.user.password);
        return isValid;
    }

    private async getUserByUsername(username: string): Promise<void> {
        if (!this.user) {
            this.user = await User.findOne({ where: { username } });
        }
    }

    private async getUserById(id: number): Promise<void> {
        if (!this.user) {
            this.user = await User.findByPk(id);
        }
    }
}
