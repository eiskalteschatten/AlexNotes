import http from '../http';
import eventBus from '../eventBus';

import { ApiReturnObjectInterface } from '../types/apiReturnObject';

interface Language {
    title: string;
    code: string;
}

export default {
    namespaced: true,
    state: {
        theme: 'light',
        languages: [{
            title: 'English',
            code: 'en'
        },
        {
            title: 'Deutsch',
            code: 'de'
        }]
    },

    getters: {
        theme: (state): string => state.theme,
        languages: (state): Language[] => state.languages
    },

    mutations: {
        setTheme(state, theme: string): void {
            state.theme = theme;
        },
        setLanguages(state, languages: Language[]): void {
            state.languages = languages;
        }
    },

    actions: {
        async setTheme({ commit }, theme: string): Promise<ApiReturnObjectInterface> {
            commit('setTheme', theme);

            try {
                const res = await http.put('api/settings', { theme });
                return {
                    code: res.status,
                    message: res.bodyText
                } as any as ApiReturnObjectInterface;
            }
            catch(error) {
                console.error(error);
                return {
                    code: 500,
                    message: error
                };
            }
        },
        async setSettings({ commit }): Promise<ApiReturnObjectInterface> {
            eventBus.$emit('show-loader');
            try {
                const res = await http.get('api/settings');

                if (res.body && res.status < 300) {
                    commit('setTheme', res.body.theme);
                    eventBus.$emit('close-loader');

                    return {
                        code: res.status,
                        message: res.bodyText
                    } as any as ApiReturnObjectInterface;
                }
                else {
                    throw new Error(res.bodyText);
                }
            }
            catch(error) {
                eventBus.$emit('close-loader');
                console.error(error);
                return {
                    code: 500,
                    message: error
                };
            }
        }
    }
};
