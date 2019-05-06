export interface DatabaseConfigInterface {
    storage: string;
    name: string;
}

export interface GitConfigAuthInterface {
    type: string;
    username?: string;
    password?: string;
    publicKeyPath?: string;
    privateKeyPath?: string;
    keyPassphrase?: string;
}
export interface GitConfigInterface {
    url: string;
    branch: string;
    auth: GitConfigAuthInterface;
    localPath: string;
}
