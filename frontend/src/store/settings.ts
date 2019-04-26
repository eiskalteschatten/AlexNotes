import http from '../http';
import eventBus from '../eventBus';

import { ApiReturnObjectInterface } from '../interfaces/apiReturnObject';

export default {
    namespaced: true,
    state: {
        theme: 'light',
        settingsFromAccount: false,
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
        theme: state => state.theme,
        settingsFromAccount: state => state.settingsFromAccount,
        languages: state => state.languages
    },

    mutations: {
        setTheme(state, theme): void {
            state.theme = theme;
        },
        setLanguages(state, languages): void {
            state.languages = languages;
        },
        setSettingsFromAccount(state, settingsFromAccount): void {
            state.settingsFromAccount = settingsFromAccount;
        }
    },

    actions: {
        async setTheme({ commit }, theme): Promise<ApiReturnObjectInterface> {
            commit('setTheme', theme);

            try {
                const res = await http.put('api/settings', { theme });
                return <ApiReturnObjectInterface>{
                    code: res.status,
                    message: res.bodyText
                };
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
                    commit('setSettingsFromAccount', true);
                    eventBus.$emit('close-loader');

                    return <ApiReturnObjectInterface>{
                        code: res.status,
                        message: res.bodyText
                    };
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