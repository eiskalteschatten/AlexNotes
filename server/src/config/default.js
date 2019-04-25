'use strict';

// const path = require('path');


module.exports = {
    proxies: {
        // '/js/libs/vue.js': path.join(__dirname, '../../node_modules/vue/dist/vue.runtime.min.js')
    },
    defaultUser: {
        firstName: 'New',
        lastName: 'User',
        username: 'admin',
        password: 'admin',
        emailAddress: ''
    },
    translations: ['en', 'de'],
    jwt: {
        secret: 'vklljgi0439u4nkfVNKCXJOu490ri$)(=%§jijglkfkljirefjo4209r4jkflmkflejf923404'
    }
};
