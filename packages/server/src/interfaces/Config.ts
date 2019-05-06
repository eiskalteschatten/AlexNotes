export interface DatabaseConfigInterface {
    storage: string;
    name: string;
}

interface GitConfigAuthInterface {
    type: string;
    username?: string;
    password?: string;
    privateKeyPath?: string;
}
export interface GitConfigInterface {
    url: string;
    branch: string;
    auth: GitConfigAuthInterface;
    localPath: string;
}
