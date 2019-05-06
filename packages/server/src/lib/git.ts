import { Repository, Clone, CloneOptions } from 'nodegit';
import * as config from 'config';

import { GitConfigInterface } from '../interfaces/Config';

const gitConfig: GitConfigInterface = config.get('git');


class Git {
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

            const repository: Repository = await Clone.clone(gitConfig.url, gitConfig.localPath, cloneOptions);
            console.log(repository);
        }
        catch(error) {
            throw new Error(error);
        }
    }
}

export default Git;
