export interface NoteMenuItemInterface {
    title: string;
    id: string;
    excerpt?: string;
    dateCreated: Date | string;
    dateUpdated: Date | string;
}

export interface NoteMetaDataInterface {
    title: string;
    id: string;
    dateCreated: Date | string;
    dateUpdated: Date | string;
}

export interface NoteDataInterface {
    markdown: string;
    html: string;
}
