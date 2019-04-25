// 'use strict';

// const Sequelize = require('sequelize');
// const {db} = require('../lib/db');

// const bcrypt = require('bcrypt-nodejs');

// const paginationLimit = 50;

// const User = db.define('users', {  // "users" because "user" is a keyword and cannot be used
//     firstName: Sequelize.STRING,
//     lastName: Sequelize.STRING,
//     username: Sequelize.STRING,
//     password: Sequelize.STRING,
//     emailAddress: Sequelize.STRING,
//     roles: Sequelize.ARRAY(Sequelize.STRING)
// });

// User.generateHash = function(password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// };

// // A hack to get Sequelize Mock to work with instance methods
// if (process.env.NODE_ENV === 'test') {
//     User.prototype = User.Instance.prototype;
// }

// User.prototype.validPassword = function(password) {
//     return bcrypt.compareSync(password, this.password);
// };

// User.getSorted = async function(attributes) {
//     return await this.findAll({
//         attributes,
//         order: [
//             [
//                 Sequelize.fn('lower', Sequelize.col('lastName')),
//                 'ASC'
//             ]
//         ]
//     });
// };

// User.getPaginated = async function(page) {
//     return await this.findAndCountAll({
//         order: [
//             [
//                 Sequelize.fn('lower', Sequelize.col('lastName')),
//                 'ASC'
//             ]
//         ],
//         limit: paginationLimit,
//         offset: paginationLimit * (page - 1)
//     });
// };

// User.sync();

// module.exports = User;
