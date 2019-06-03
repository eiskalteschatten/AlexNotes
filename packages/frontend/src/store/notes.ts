import http from '../http';

import { ApiReturnObjectInterface } from '../types/apiReturnObject';
import { NoteMetaDataInterface } from '../../../shared/types/notes';

export default {
    namespaced: true,
    state: {
        notes: [],
        selectedNoteId: '',
        selectedNote: {}
    },

    getters: {
        getNotes: (state): NoteMetaDataInterface[] => state.notes,
        getSelectedNoteId: (state): string => state.selectedNoteId,
        getSelectedNote: (state): NoteMetaDataInterface => state.selectedNote
    },

    mutations: {
        setNotes(state, notes: NoteMetaDataInterface[]): void {
            state.notes = notes;
        },
        resetNotes(state): void {
            state.notes = [];
            state.selectedNoteId = '';
            state.selectedNote = {};
        },
        resetSelectedNote(state): void {
            state.selectedNoteId = '';
            state.selectedNote = {};
        },
        setSelectedNoteId(state, selectedNoteId: string): void {
            state.selectedNoteId = selectedNoteId;
        },
        setSelectedNote(state, selectedNoteId: string): void {
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
                    throw new Error('No notes could be fetched');
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
        }//,
        // async deleteNotebook({ dispatch }, id: string): Promise<ApiReturnObjectInterface> {
        //     try {
        //         const encodedId: string = encodeURIComponent(id);
        //         const res = await http.delete(`api/notebooks/${encodedId}`);

        //         dispatch('getNotebooks');

        //         return {
        //             code: res.status,
        //             message: res.bodyText
        //         } as any as ApiReturnObjectInterface;
        //     }
        //     catch(error) {
        //         console.error(error);
        //         return {
        //             code: error.status | 500,
        //             message: error.bodyText
        //         };
        //     }
        // }
    }
};
