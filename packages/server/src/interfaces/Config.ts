export interface DatabaseConfigInterface {
    storage: string;
    name: string;
}

export interface GitConfigAuthInterface {
    type: string;
    username?: string;
    password?: string;
}

export interface GitPullPushCronjobInterface {
    time: string;
    timezone: string;
}

export interface GitConfigInterface {
    url: string;
    branch: string;
    auth: GitConfigAuthInterface;
    localPath: string;
    pullPushCronjob: GitPullPushCronjobInterface;
}
