import http from '../http';
import eventBus from '../eventBus';

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
        setTheme(state, theme) {
            state.theme = theme;
        },
        setLanguages(state, languages) {
            state.languages = languages;
        },
        setSettingsFromAccount(state, settingsFromAccount) {
            state.settingsFromAccount = settingsFromAccount;
        }
    },

    actions: {
        async setTheme({ commit }, theme) {
            commit('setTheme', theme);

            try {
                const res = await http.put('api/settings', { theme });
                return {
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
        async setSettings({ commit }) {
            eventBus.$emit('show-loader');
            try {
                const res = await http.get('api/settings');

                if (res.body && res.status < 300) {
                    commit('setTheme', res.body.theme);
                    commit('setSettingsFromAccount', true);
                    eventBus.$emit('close-loader');

                    return {
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
