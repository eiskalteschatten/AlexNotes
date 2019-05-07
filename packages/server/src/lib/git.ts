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
        this.git = simplegit();

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
        }
        catch(error) {
            console.error(error);
        }
    }

    public async clone(): Promise<void> {
        try {
            console.log('Cloning git repository from');
            console.log('--- from:', this.url);
            console.log('--- to:', gitConfig.localPath);

            const cloneOptions: string[] = [
                `--branch=${gitConfig.branch}`
            ];

            await this.git.clone(this.url, gitConfig.localPath, cloneOptions);

            console.log('Git repository successfully cloned.');
        }
        catch(error) {
            console.error(error);
        }
    }
}

export default Git;
