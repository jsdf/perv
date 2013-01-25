var Sequelize = require("sequelize");

function db(config) {
  return new Sequelize(config.db, config.user, config.pass, config.options);
}