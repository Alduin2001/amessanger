const Sequelize = require('sequelize');
let db = new Sequelize(
    'messanger',
    'root',
    'root',
    {
    dialect:'mysql',
    host:'localhost'
}
);
module.exports = db;