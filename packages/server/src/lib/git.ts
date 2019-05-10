import * as simplegit from 'simple-git/promise';
import * as config from 'config';
import * as fs from 'fs';

import { GitConfigInterface, GitConfigAuthInterface } from '../interfaces/Config';

const gitConfig: GitConfigInterface = config.get('git');


class Git {
    private git: simplegit.SimpleGit;
    private url: string = gitConfig.url;
    private readonly gitAuth: GitConfigAuthInterface = gitConfig.auth;

    public constructor() {
        this.git = fs.existsSync(gitConfig.localPath) ? simplegit(gitConfig.localPath) : simplegit();

        if (this.gitAuth.type === 'https') {
            if (this.url.substring(0,7) !== 'https://') {
                this.url = 'https://' + this.url;
            }

            if (!this.url.match(/https:\/\/(.*):(.*)@/g)) {
                const urlsParts: string[] = this.url.split('//');
                this.url = `https://${this.gitAuth.username}:${this.gitAuth.password}@${urlsParts[2]}`;
            }
        }
        else if (this.gitAuth.type !== 'ssh' && this.gitAuth.type !== 'https') {
            throw new Error('The git auth type must be "ssh" or "https".');
        }
    }

    public async initialize(): Promise<void> {
        try {
            if (!fs.existsSync(gitConfig.localPath)) {
                await this.clone();
            }
            else {
                await this.pull();
            }
        }
        catch(error) {
            throw new Error(error);
        }
    }

    public async clone(): Promise<void> {
        try {
            console.log('Cloning git repository');
            console.log('--- from:', this.url);
            console.log('--- to:', gitConfig.localPath);

            const cloneOptions: string[] = [
                `--branch=${gitConfig.branch}`
            ];

            await this.git.clone(this.url, gitConfig.localPath, cloneOptions);

            console.log('Git repository successfully cloned.');
        }
        catch(error) {
            throw new Error(error);
        }
    }

    public async pull(): Promise<boolean> {
        try {
            console.log('Pulling from the git repository.');
            await this.git.pull(gitConfig.localPath);
            console.log('Finished pulling.');
            return true;
        }
        catch(error) {
            throw new Error(error);
            return false;
        }
    }

    public async add(): Promise<void> {
        try {
            console.log('Staging all files for committing.');
            await this.git.add('.');
            console.log('All files staged for committing.');
        }
        catch(error) {
            throw new Error(error);
        }
    }

    public async commit(commitMessage: string): Promise<void> {
        try {
            console.log('Committing staged files.');
            await this.git.commit(commitMessage);
            console.log('All staged files committed.');
        }
        catch(error) {
            throw new Error(error);
        }
    }

    public async push(): Promise<void> {
        try {
            console.log('Pushing all local commits.');
            await this.git.push('origin', gitConfig.branch);
            console.log('All local commits pushed.');
        }
        catch(error) {
            throw new Error(error);
        }
    }

    public async addCommitPullPush(commitMessage: string): Promise<void> {
        try {
            await this.add();
            await this.commit(commitMessage);
            await this.pull();
            await this.push();
        }
        catch(error) {
            throw new Error(error);
        }
    }
}

export default Git;
