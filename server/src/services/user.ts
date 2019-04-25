import * as bcrypt from 'bcrypt';
import * as config from 'config';

import { User, UserAddModel, UserViewModel } from '../models/user';

export default class UserService {
    private readonly saltRounds = 12;
    private readonly jwtSecret = config.get('jwt.secret');
    private user: User;

    public getUser() {
        return this.user;
    }

    public async register({ firstName, lastName, username, password, emailAddress }: UserAddModel): Promise<UserViewModel> {
        const existingUser: User = await User.findOne({ where: { username } });

        if (existingUser) {
            throw new Error('Could not create user because a user with this username already exists!');
            return;
        }

        const hash: string = await bcrypt.hash(password, this.saltRounds);
        const userModel: User = await User.create({ firstName, lastName, username, password: hash, emailAddress })
        await this.getUserById(userModel.id);
        return this.user;
    }

    public async localLogin(username, password: string): Promise<boolean> {
        await this.getUserByUsername(username);
        const hasValidPassword: boolean = await this.validatePassword(password);
        return this.user && hasValidPassword;
    }

    public async jwtLogin(id: string | number): Promise<boolean> {
        await this.getUserById(id);
        return !! this.user;
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

    private async getUserById(id: string | number): Promise<void> {
        if (!this.user) {
            this.user = await User.findByPk(id);
        }
    }
}
