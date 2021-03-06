import Vue, { VNode } from 'vue';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';
import { mapState, mapActions } from 'vuex';

import Vuetify from 'vuetify';
import en from 'vuetify/es5/locale/en';
import de from 'vuetify/es5/locale/de';

import * as cookies from 'browser-cookies';

import theme from './theme';
import store from './store';
import http from './http';
import router, { routeTitles, setDocumentTitle } from './router';
import { buildFromRoute } from './lib/buildFromRoute';

import App from './components/App.vue';

import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

const locale: string = cookies.get('preferedLanguage') || 'en';

const sharedDateTimeFormats = {
    numeric: {
        year: 'numeric', month: 'numeric', day: 'numeric'
    },
    short: {
        year: 'numeric', month: 'short', day: 'numeric'
    },
    long: {
        year: 'numeric', month: 'short', day: 'numeric',
        weekday: 'short', hour: 'numeric', minute: 'numeric'
    }
};

const dateTimeFormats = {
    en: sharedDateTimeFormats,
    de: sharedDateTimeFormats
};

Vue.use(VueRouter);
Vue.use(VueI18n);
Vue.use(Vuetify, {
    theme,
    iconfont: 'md',
    lang: {
        locales: { en, de },
        current: locale
    },
    options: {
        customProperties: true
    }
});

const i18n = new VueI18n({
    locale,
    dateTimeFormats,
    fallbackLocale: 'en',
    silentTranslationWarn: true
});

new Vue({
    store,
    router,
    i18n,
    http,
    computed: {
        ...mapState('user', [
            'currentJwt'
        ])
    },
    watch: {
        '$route'(to): void {
            const lang = to.params.lang;
            this.$i18n.locale = lang;
            cookies.set('preferedLanguage', lang);
            setDocumentTitle(routeTitles[lang][to.name]);
        }
    },
    async created(): Promise<void> {
        await this.determineAuthentication();
    },
    async mounted(): Promise<void> {
        const title = routeTitles[this.$i18n.locale][this.$route.name];
        setDocumentTitle(title);
        await buildFromRoute(this);
    },
    methods: {
        ...mapActions('user', [
            'fetchJwt'
        ]),
        async determineAuthentication(): Promise<void> {
            const jwt = localStorage.getItem('jwt');

            if (!jwt && !this.currentJwt && this.$route.name !== 'login') {
                this.$router.replace({ name: 'login' });
            }
            else if (jwt && !this.currentJwt) {
                const isLoggedIn = await this.fetchJwt();
                if (!isLoggedIn) {
                    this.$router.replace({ name: 'login' });
                }
            }
        }
    },
    render: (createElement): VNode => createElement(App)
}).$mount('#vueAnchor');
