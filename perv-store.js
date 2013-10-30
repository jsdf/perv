var Sequelize = require("sequelize");

function PervStore(config) {
  this.db = new Sequelize(config.db, config.user, config.pass, config.options);

  this.Event = this.db.define('event', {
    watch_path : Sequelize.STRING
  , type       : Sequelize.STRING
  , filename   : Sequelize.STRING
  });
}

PervStore.prototype.write = function(ev) {
  console.log('saving',ev);
  this.Event.build({
    watch_path: ev.watch
  , type : ev.masks[0]
  , filename : ev.name
  }).save().error(function(error) {
    console.error('error saving',ev,error);
  });
};

PervStore.prototype.findAll = function(conditions, callback) {
  this.Event.findAll(conditions).success(callback).error(function(error) {
    console.error(error);
  });
};

PervStore.prototype.listDates = function(callback) {
  var query = 'SELECT DISTINCT DATE(`createdAt`) as date FROM events ORDER BY createdAt DESC';
  this.db.query(query, null, { raw: true })
    .success(callback)
    .error(function(error) {
      console.error(error);
    });
};

PervStore.prototype.getDay = function(date, callback) {
  this.findAll({where: ['DATE(createdAt) = ?', date]}, callback);
};

module.exports = PervStore;