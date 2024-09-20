const Sequelize = require('sequelize');
 require('dotenv').config();

const databaseConfig = JSON.parse(process.env.databaseCOnfig);

const sequelize = new Sequelize(
  databaseConfig.development.database,
  databaseConfig.development.username,
  databaseConfig.development.password,
  {
    host: databaseConfig.development.host,
    dialect: databaseConfig.development.dialect
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;