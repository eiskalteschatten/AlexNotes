export interface FolderMenuItemInterface {
    title: string;
    id: string;
    subfolders?: FolderMenuItemInterface[];
}

export interface FolderMetaDataInterface {
    title: string;
    id: string;
    parent: string;
}
