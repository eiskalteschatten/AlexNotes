'use strict';

const Sequelize = require('sequelize');
const {db} = require('../lib/db');

const User = require('./User');

const Settings = db.define('settings', {
    theme: {
        type: Sequelize.ENUM('LIGHT', 'DARK'),
        defaultValue: 'LIGHT',
        get() {
            const theme = this.getDataValue('theme');
            return theme.toLowerCase();
        },
        set(value) {
            this.setDataValue('theme', value.toUpperCase());
        }
    }
});

User.hasOne(Settings);
Settings.belongsTo(User);

Settings.sync();

module.exports = Settings;
