import { Repository, Clone, CloneOptions } from 'nodegit';
import * as config from 'config';

import { GitConfigInterface } from '../interfaces/Config';

const gitConfig: GitConfigInterface = config.get('git');


class Git {
    private url: string = gitConfig.url;

    public constructor() {
        if (gitConfig.auth.type === 'ssh' && this.url.substring(0,6) !== 'ssh://') {
            this.url = 'ssh://' + this.url;
        }
        else if (gitConfig.auth.type === 'https' && this.url.substring(0,7) !== 'https://') {
            this.url = 'https://' + this.url;
        }
        else if (gitConfig.auth.type !== 'ssh' && gitConfig.auth.type !== 'https') {
            throw new Error('The git auth type must be "ssh" or "https".');
        }
    }

    public async initialize(): Promise<void> {
        try {
            await this.clone();
        }
        catch(error) {
            throw new Error(error);
        }
    }

    public async clone(): Promise<void> {
        try {
            const cloneOptions: CloneOptions = {
                checkoutBranch: gitConfig.branch
            };

            const repository: Repository = await Clone.clone(this.url, gitConfig.localPath, cloneOptions);
            console.log(repository);
        }
        catch(error) {
            throw new Error(error);
        }
    }
}

export default Git;
