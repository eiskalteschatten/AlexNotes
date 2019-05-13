import http from '../http';

import { ApiReturnObjectInterface } from '../types/apiReturnObject';
import { FolderMenuItemInterface } from '../../../shared/types/folders';

export interface RenameFolderValuesInterface {
    id: string;
    newName: string;
}


export default {
    namespaced: true,
    state: {
        folders: [],
        selectedFolderId: ''
    },

    getters: {
        getFolders: (state): FolderMenuItemInterface[] => state.folders,
        getSelectedFolderId: (state): string => state.selectedFolderId
    },

    mutations: {
        setFolders(state, folders: FolderMenuItemInterface[]): void {
            state.folders = folders;
        },
        setSelectedFolderId(state, selectedFolderId: string): void {
            state.selectedFolderId = selectedFolderId;
        }
    },

    actions: {
        async getFolders({ commit }, notebookId: string): Promise<ApiReturnObjectInterface> {
            try {
                const res = await http.get(`api/folders?notebookId=${notebookId}`);

                if (!res.body) {
                    throw new Error('No folders could be fetched');
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
        async saveFolder({ dispatch }, name: string): Promise<ApiReturnObjectInterface> {
            try {
                const res = await http.put('api/folders', { name });

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
                const res = await http.delete(`api/folders/${id}`);

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
