import VueRouter from 'vue-router';
import * as cookies from 'browser-cookies';

import MainLayout from './components/MainLayout.vue';
import LoggedOutLayout from './components/LoggedOutLayout.vue';

import Home from './components/pages/Home.vue';
import AccountSettings from './components/pages/AccountSettings.vue';
import Settings from './components/pages/Settings.vue';

import Login from './components/pages/Login.vue';

import NotFound from './components/pages/errors/404.vue';

const preferedLanguage = cookies.get('preferedLanguage') || 'en';

export const routeTitles = {
    primaryTitle: 'AlexNotes',
    en: {
        home: 'Notes',
        login: 'Login',
        accountSettings: 'Account Settings',
        settings: 'Settings',
        '404': 'Page not found'
    },
    de: {
        home: 'Notes',
        login: 'Login',
        accountSettings: 'Kontoeinstellungen',
        settings: 'Einstellungen',
        '404': 'Seite nicht gefunden'
    }
};

const router = new VueRouter({
    routes: [{
        path: '/',
        redirect: { name: 'home', params: { lang: preferedLanguage } }
    },
    {
        path: '/:lang',
        component: MainLayout,
        children: [{
            path: '',
            name: 'home',
            component: Home
        },
        {
            path: 'account-settings',
            name: 'accountSettings',
            component: AccountSettings
        },
        {
            path: 'settings',
            name: 'settings',
            component: Settings
        }]
    },
    {   // Login should not be a child of MainLayout
        path: '/:lang/login',
        component: LoggedOutLayout,
        children: [{
            path: '',
            name: 'login',
            component: Login
        }]
    },
    {
        path: '*',
        component: MainLayout,
        children: [{
            path: '',
            name: '404',
            component: NotFound
        }]
    }]
});

export function setDocumentTitle(title: string): void {
    document.title = `${title} - ${routeTitles.primaryTitle}`;
}

export default router;
