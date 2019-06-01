import Vue from 'vue';

import eventBus from '../eventBus';

import { SelectEvent } from '../types/selectEvent';

export async function buildFromRoute(vue: Vue): Promise<void> {
    const notebookId: string = vue.$route.params.notebook;
    const folderId: string = vue.$route.params.folder;
    const noteId: string = vue.$route.params.note;

    if (notebookId) {
        await eventBus.$emit('selectNotebook', notebookId);
    }

    if (folderId) {
        const params: SelectEvent = {
            id: folderId,
            async callback(): Promise<void> {
                if (noteId) {
                    await eventBus.$emit('selectNote', noteId);
                }
            }
        };

        await eventBus.$emit('selectFolder', params);
    }
}
