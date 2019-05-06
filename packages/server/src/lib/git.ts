import { Repository, Clone, CloneOptions, FetchOptions, Cred } from 'nodegit';
import * as config from 'config';

import { GitConfigInterface, GitConfigAuthInterface } from '../interfaces/Config';

const gitConfig: GitConfigInterface = config.get('git');


class Git {
    private repository: Repository;
    private url: string = gitConfig.url;
    private gitAuth: GitConfigAuthInterface = gitConfig.auth;

    public constructor() {
        if (this.gitAuth.type === 'https' && this.url.substring(0,7) !== 'https://') {
            this.url = 'https://' + this.url;
        }
        else if (this.gitAuth.type !== 'ssh' && this.gitAuth.type !== 'https') {
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
            const fetchOpts: FetchOptions = {
                remoteCallbacks: {
                    credentials: async (url: string, username: string): Promise<Cred> => {
                        const cred: Cred = await Cred.sshKeyMemoryNew(username, this.gitAuth.publicKeyPath, this.gitAuth.privateKeyPath, this.gitAuth.keyPassphrase);
                        return cred;
                    }
                }
            };

            const cloneOptions: CloneOptions = {
                checkoutBranch: gitConfig.branch,
                fetchOpts
            };

            console.log('Cloning git repository from:', this.url);

            this.repository = await Clone.clone(this.url, gitConfig.localPath, cloneOptions);
            console.log(this.repository);
        }
        catch(error) {
            throw new Error(error);
        }
    }
}

export default Git;
