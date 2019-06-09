import http from '../http';

import { ApiReturnObjectInterface } from '../types/apiReturnObject';
import { NoteMenuItemInterface, NoteDataInterface } from '../../../shared/types/notes';

export default {
    namespaced: true,
    state: {
        notes: [],
        selectedNoteId: '',
        selectedNote: {},
        selectedNoteMenuItem: {}
    },

    getters: {
        getNotes: (state): NoteMenuItemInterface[] => state.notes,
        getSelectedNoteId: (state): string => state.selectedNoteId,
        getSelectedNote: (state): NoteDataInterface => state.selectedNote,
        getSelectedNoteMenuItem: (state): NoteMenuItemInterface => state.selectedNoteMenuItem
    },

    mutations: {
        setNotes(state, notes: NoteMenuItemInterface[]): void {
            state.notes = notes;
        },
        resetNotes(state): void {
            state.notes = [];
            state.selectedNoteId = '';
            state.selectedNote = {};
            state.selectedNoteMenuItem = {};
        },
        resetSelectedNote(state): void {
            state.selectedNoteId = '';
            state.selectedNote = {};
            state.selectedNoteMenuItem = {};
        },
        setSelectedNoteId(state, selectedNoteId: string): void {
            state.selectedNoteId = selectedNoteId;
        },
        setSelectedNote(state, selectedNote: string): void {
            state.selectedNote = selectedNote;
        },
        setSelectedNoteMenuItem(state, selectedNoteId: string): void {
            for (const note of state.notes) {
                if (note.id === selectedNoteId) {
                    state.selectedNote = note;
                    break;
                }
            }
        }
    },

    actions: {
        async getNotes({ commit, rootState }): Promise<ApiReturnObjectInterface> {
            try {
                if (!rootState.folders.selectedFolderId) {
                    return;
                }

                commit('resetNotes');

                const res = await http.get(`api/notes?folderId=${rootState.folders.selectedFolderId}`);

                if (!res.body) {
                    throw new Error('No notes could not be fetched');
                }

                commit('setNotes', res.body);

                return {
                    code: res.status,
                    message: res.bodyText
                } as any as ApiReturnObjectInterface;
            }
            catch(error) {
                console.error(error);
                return {
                    code: error.status | 500,
                    message: error.bodyText
                };
            }
        },
        async getSelectedNote({ commit, rootState }, noteId: string): Promise<ApiReturnObjectInterface> {
            try {
                if (!rootState.folders.selectedFolderId) {
                    return;
                }

                const res = await http.get(`api/notes/note?noteId=${noteId}&folderId=${rootState.folders.selectedFolderId}`);

                if (!res.body) {
                    throw new Error('The selected note could not be fetched');
                }

                commit('setSelectedNote', res.body);

                return {
                    code: res.status,
                    message: res.bodyText
                } as any as ApiReturnObjectInterface;
            }
            catch(error) {
                console.error(error);
                return {
                    code: error.status | 500,
                    message: error.bodyText
                };
            }
        },
        async saveNote({ state, dispatch, rootState }, title: string): Promise<ApiReturnObjectInterface> {
            try {
                const res = await http.put('api/notes', {
                    content: rootState.editor.content,
                    title,
                    folderId: rootState.folders.selectedFolderId,
                    metaData: state.selectedNote
                });

                dispatch('getNotes');

                return {
                    code: res.status,
                    message: res.bodyText,
                    body: res.body
                } as any as ApiReturnObjectInterface;
            }
            catch(error) {
                console.error(error);
                return {
                    code: error.status | 500,
                    message: error.bodyText
                };
            }
        },
        async deleteNote({ dispatch, commit, state, rootState }, id?: string): Promise<ApiReturnObjectInterface> {
            try {
                if (!rootState.folders.selectedFolderId) {
                    return;
                }

                const encodedFolderId: string = encodeURIComponent(rootState.folders.selectedFolderId);
                const deleteId = id ? id : state.selectedNoteId;
                const encodedId: string = encodeURIComponent(deleteId);
                const res = await http.delete(`api/notes/${encodedFolderId}/${encodedId}/`);

                commit('resetSelectedNote');
                dispatch('getNotes');

                return {
                    code: res.status,
                    message: res.bodyText
                } as any as ApiReturnObjectInterface;
            }
            catch(error) {
                console.error(error);
                return {
                    code: error.status | 500,
                    message: error.bodyText
                };
            }
        }
    }
};
