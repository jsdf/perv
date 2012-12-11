var PervStore = require('./perv-store.js');

var config = require('./config.json');

var store = new PervStore(config.database);

store.db.sync();