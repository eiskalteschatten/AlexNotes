import http from '../http';

import { ApiReturnObjectInterface } from '../types/apiReturnObject';
import { FolderMenuItemInterface } from '../../../shared/types/folders';

export interface SaveFolderValuesInterface {
    title: string;
    parent: string;
}

export interface RenameFolderValuesInterface {
    id: string;
    newName: string;
}


export default {
    namespaced: true,
    state: {
        folders: [],
        selectedFolderId: '',
        renamingId: '',
        renamingValue: ''
    },

    getters: {
        getFolders: (state): FolderMenuItemInterface[] => state.folders,
        getSelectedFolderId: (state): string => state.selectedFolderId,
        getFolderIdNoNotebook(state): string {
            const idParts: string[] = state.selectedFolderId.split('/');
            idParts.shift();
            return idParts.join('/');
        },
        getRenamingId: (state): string => state.renamingId,
        getRenamingValue: (state): string => state.renamingValue
    },

    mutations: {
        setFolders(state, folders: FolderMenuItemInterface[]): void {
            state.folders = folders;
        },
        resetFolders(state): void {
            state.folders = [];
            state.selectedFolderId = '';
        },
        setSelectedFolderId(state, selectedFolderId: string): void {
            state.selectedFolderId = selectedFolderId;
        },
        setRenamingId(state, renamingId: string): void {
            state.renamingId = renamingId;
        },
        setRenamingValue(state, renamingValue: string): void {
            state.renamingValue = renamingValue;
        }
    },

    actions: {
        async getFolders({ commit, rootState }): Promise<ApiReturnObjectInterface> {
            try {
                commit('resetFolders');

                const res = await http.get(`api/folders?notebookId=${rootState.notebooks.selectedNotebookId}`);

                if (!res.body) {
                    throw new Error('No folders could not be fetched');
                }

                commit('setFolders', res.body);

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
        async saveFolder({ dispatch }, values: SaveFolderValuesInterface): Promise<ApiReturnObjectInterface> {
            try {
                const res = await http.put('api/folders', values);

                dispatch('getFolders');

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
        async deleteFolder({ dispatch }, id: string): Promise<ApiReturnObjectInterface> {
            try {
                const encodedId: string = encodeURIComponent(id);
                const res = await http.delete(`api/folders/${encodedId}`);

                dispatch('getFolders');

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
        async renameFolder({ dispatch }, values: RenameFolderValuesInterface): Promise<ApiReturnObjectInterface> {
            try {
                const res = await http.patch('api/folders/rename/', values);

                dispatch('getFolders');

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
