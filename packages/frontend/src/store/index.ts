import Vue from 'vue';
import Vuex from 'vuex';

// import http from '../http';
import eventBus from '../eventBus';

import user from './user';
import settings from './settings';
import notebooks from './notebooks';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        user,
        settings,
        notebooks
    }
});

export async function fillStore(): Promise<void> {
    await store.dispatch('settings/setSettings', {}, { root: true });

    eventBus.$emit('show-loader');

    try {
        // const commit = store.commit;
        // const res = await http.get('api/initial');

        // if (res.body && res.status < 300) {
        //     const body = res.body;
        //     if (body.notebooks) commit('notebooks/setNotebooks', body.notebooks);
        // }
        // else {
        //     throw new Error(res.bodyText);
        // }

        eventBus.$emit('close-loader');
    }
    catch(error) {
        eventBus.$emit('close-loader');
        console.error(error);
    }
}

export default store;
