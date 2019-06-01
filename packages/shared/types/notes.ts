export interface NoteMenuItemInterface {
    title: string;
    id: string;
    content: string;
    dateCreated: Date;
    dateUpdated: Date;
    icon?: string;
}

export interface NoteMetaDataInterface {
    title: string;
    id: string;
    content: string;
    markdown: string;
    dateCreated: Date;
    dateUpdated: Date;
}
