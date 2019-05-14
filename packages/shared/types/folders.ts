export interface FolderMenuItemInterface {
    title: string;
    icon?: string;
    id: string;
    subfolders?: FolderMenuItemInterface[];
}

export interface FolderMetaDataInterface {
    title: string;
    id: string;
}
