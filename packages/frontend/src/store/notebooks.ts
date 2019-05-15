import http from '../http';

import { ApiReturnObjectInterface } from '../types/apiReturnObject';
import { NotebookMenuItemInterface } from '../../../shared/types/notebooks';

export interface RenameNotebookValuesInterface {
    id: string;
    newName: string;
}


export default {
    namespaced: true,
    state: {
        notebooks: [],
        selectedNotebookId: ''
    },

    getters: {
        getNotebooks: (state): NotebookMenuItemInterface[] => state.notebooks,
        getSelectedNotebookId: (state): string => state.selectedNotebookId
    },

    mutations: {
        setNotebooks(state, notebooks: NotebookMenuItemInterface[]): void {
            state.notebooks = notebooks;
        },
        setSelectedNotebookId(state, selectedNotebookId: string): void {
            state.selectedNotebookId = selectedNotebookId;
        }
    },

    actions: {
        async getNotebooks({ commit }): Promise<ApiReturnObjectInterface> {
            try {
                const res = await http.get('api/notebooks');

                if (!res.body) {
                    throw new Error('No notebooks could be fetched');
                }

                commit('setNotebooks', res.body);

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
        async saveNotebook({ dispatch }, title: string): Promise<ApiReturnObjectInterface> {
            try {
                const res = await http.put('api/notebooks', { title });

                dispatch('getNotebooks');

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
        async deleteNotebook({ dispatch }, id: string): Promise<ApiReturnObjectInterface> {
            try {
                const res = await http.delete(`api/notebooks/${id}`);

                dispatch('getNotebooks');

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
        async renameNotebook({ dispatch }, values: RenameNotebookValuesInterface): Promise<ApiReturnObjectInterface> {
            try {
                const res = await http.patch('api/notebooks/rename/', values);

                dispatch('getNotebooks');

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
