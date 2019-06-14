'use strict';

const path = require('path');
const homedir = require('os').homedir();

const baseConfig = process.env.NODE_ENV === 'test' ?  require('../test/config.test') : require('../../../config');

module.exports = {
    proxies: {
        // '/js/libs/vue.js': path.join(__dirname, '../../node_modules/vue/dist/vue.runtime.min.js')
    },
    database: {
        storage: path.resolve(homedir, '.alexnotes', 'storage.sqlite3'),
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
    },
    ...baseConfig
};
