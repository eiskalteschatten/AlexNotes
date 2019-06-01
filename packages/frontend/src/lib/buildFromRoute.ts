import Vue from 'vue';

import eventBus from '../eventBus';

export async function buildFromRoute(vue: Vue): Promise<void> {
    const notebookId: string = vue.$route.params.notebook;
    const folderId: string = vue.$route.params.folder;
    const noteId: string = vue.$route.params.note;

    if (notebookId) {
        await eventBus.$emit('selectNotebook', notebookId);
    }

    if (folderId) {
        await eventBus.$emit('selectFolder', folderId);
    }

    if (noteId) {
        await eventBus.$emit('selectNote', noteId);
    }
}
