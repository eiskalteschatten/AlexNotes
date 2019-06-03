export interface NoteMetaDataInterface {
    title: string;
    id: string;
    content?: string;
    markdown?: string;
    dateCreated: Date | string;
    dateUpdated: Date | string;
}
