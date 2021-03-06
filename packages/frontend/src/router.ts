import VueRouter from 'vue-router';
import * as cookies from 'browser-cookies';

import MainLayout from './components/MainLayout.vue';
import LoggedOutLayout from './components/LoggedOutLayout.vue';
import PageWrapper from './components/PageWrapper.vue';

import Default from './components/pages/Default.vue';
import MarkdownViewer from './components/pages/MarkdownViewer.vue';
import NotesEditor from './components/pages/NotesEditor.vue';
import AccountSettings from './components/pages/AccountSettings.vue';
import Settings from './components/pages/Settings.vue';

import Login from './components/pages/Login.vue';

import NotFound from './components/pages/errors/404.vue';

const preferedLanguage = cookies.get('preferedLanguage') || 'en';

export const routeTitles = {
    primaryTitle: 'AlexNotes',
    en: {
        login: 'Login',
        accountSettings: 'Account Settings',
        settings: 'Settings',
        '404': 'Page not found'
    },
    de: {
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
            component: Default
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
    {
        path: '/:lang/nb/:notebook',
        component: MainLayout,
        children: [{
            path: '',
            name: 'notebook',
            component: Default
        },
        {
            path: 'f/:folder',
            component: PageWrapper,
            children: [{
                path: '',
                name: 'folder',
                component: Default
            },
            {
                path: 'n/:note',
                component: PageWrapper,
                children: [{
                    path: '',
                    name: 'note',
                    component: MarkdownViewer
                },
                {
                    path: 'edit',
                    name: 'editNote',
                    component: NotesEditor
                }]
            },
            {
                path: 'new-note',
                name: 'newNote',
                component: NotesEditor
            }]
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
    document.title = title ? `${title} - ${routeTitles.primaryTitle}` : routeTitles.primaryTitle;
}

export default router;
