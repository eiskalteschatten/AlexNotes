import * as simplegit from 'simple-git/promise';
import * as config from 'config';
import * as fs from 'fs';
import * as path from 'path';
import { sync as mkdirpSync } from 'mkdirp';

import { GitConfigInterface, GitConfigAuthInterface } from '../interfaces/Config';

const gitConfig: GitConfigInterface = config.get('git');


class Git {
    private git: simplegit.SimpleGit;
    private url: string = gitConfig.url;
    private readonly gitAuth: GitConfigAuthInterface = gitConfig.auth;

    public constructor() {
        if (!fs.existsSync(gitConfig.localPath)) {
            mkdirpSync(gitConfig.localPath);
        }

        this.git = simplegit(gitConfig.localPath);

        if (this.gitAuth.type === 'https') {
            if (this.url.substring(0,7) !== 'https://') {
                this.url = 'https://' + this.url;
            }

            if (!this.url.match(/https:\/\/(.*):(.*)@/g)) {
                const urlsParts: string[] = this.url.split('//');
                this.url = `https://${this.gitAuth.username}:${this.gitAuth.password}@${urlsParts[2]}`;
            }
        }
        else if (this.gitAuth.type !== 'ssh' && this.gitAuth.type !== 'https' && this.gitAuth.type !== 'local') {
            throw new Error('The git auth type must be "ssh", "https" or "local".');
        }
    }

    public async initialize(): Promise<void> {
        try {
            const pathToGit: string = path.resolve(gitConfig.localPath, '.git');
            const isRepo: boolean = fs.existsSync(pathToGit);

            if (!isRepo) {
                if (process.env.NODE_ENV === 'test') {
                    console.log('Initializing git repo at', gitConfig.localPath);
                    await this.git.init();
                    await this.git.checkoutLocalBranch(gitConfig.branch);
                }
                else {
                    await this.clone();
                }
            }
            else if (this.gitAuth.type !== 'local') {
                await this.pull();
                await this.push();
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
            if (this.gitAuth.type === 'local') {
                return false;
            }

            console.log('Pulling from the git repository.');
            await this.git.pull(gitConfig.localPath, gitConfig.branch);
            console.log('Finished pulling.');
            return true;
        }
        catch(error) {
            throw new Error(error);
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
            if (this.gitAuth.type === 'local') {
                return;
            }

            console.log('Pushing all local commits.');
            await this.git.push('origin', gitConfig.branch);
            console.log('All local commits pushed.');
        }
        catch(error) {
            throw new Error(error);
        }
    }

    public async addCommit(commitMessage: string): Promise<void> {
        try {
            await this.add();
            await this.commit(commitMessage);
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

    public async cronjob(): Promise<void> {
        try {
            console.log('Starting scheduled git pull and push.');
            await this.addCommitPullPush('Commit any un-committed changes.');
            console.log('Scheduled git pull and push finished successfully.');
        }
        catch(error) {
            console.error(error);
            console.error('Scheduled git pull and push finished with an error.');
        }
    }
}

export default Git;
