'use strict';

const path = require('path');

const baseConfig = require('../../../config');


module.exports = {
    ...baseConfig,
    proxies: {
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
    notes: {
        folder: 'notes'
    }
};
