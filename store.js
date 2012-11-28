var Sequelize = require("sequelize");
var sequelize = new Sequelize('james_perv', 'james', 'dhm3d14', { logging: false });

var Event = sequelize.define('event', {
  watch_path : Sequelize.STRING
, type       : Sequelize.STRING
, filename   : Sequelize.STRING
});

module.exports = {
  write : function(ev) {
    Event.build({
      watch_path: ev.watch
    , type : ev.masks[0]
    , filename : ev.name
    }).save().error(function(error) {
      console.error(error);
    });
  }
, db : sequelize
};