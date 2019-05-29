'use strict';

const path = require('path');
const frontendPath = require('alexnotes-frontend').default;

const baseConfig = require('../../../config');

function monacoLanguages() {
    const files = {};
    const languages = [...Array(1).keys()];

    for (const language in languages) {
        const fileName = `${language}.index.js`;
        files[`/${fileName}`] = path.join(frontendPath, 'assets', fileName);
    }

    return files;
}

module.exports = {
    ...baseConfig,
    proxies: {
        ...monacoLanguages()
        // '/js/libs/vue.js': path.join(__dirname, '../../node_modules/vue/dist/vue.runtime.min.js')
    },
    database: {
        storage: path.resolve(__dirname, '..', '..', '..', 'storage.sqlite3'),
        name: 'alexnotes'
    },
    translations: ['en', 'de'],
    jwt: {
        secret: 'vklljgi0439u4nkfVNKCXJOu490ri$)(=%§jijglkfkljirefjo4209r4jkflmkflejf923404'
    },
    authentication: {
        noAuth: /^((?!\/$|login|status|assets|favicon|apple-touch|site\.webmanifest|safari-pinned|\.index\.js).)*$/
    },
    notes: {
        folder: 'notes'
    }
};
