const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Key = require('./key')(sequelize, DataTypes);
db.Admin = require('./admin')(sequelize, DataTypes);

module.exports = db; 