var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));

var PervStore = require('./perv-store.js');

var config = require('./config.json');

var store = new PervStore(config.database);

app.get('/', function(req, res) {
  var client_data = {
    base_watch_path: config.watch_path
  };

  var body = [
    '<html><head>',
    '<title>perv viewer</title>',
    '<link rel="stylesheet" type="text/css" href="/css/perv.css"></link>',
    '<script src="js/jquery-1.8.2.js"></script>',
    '<script src="js/moment.js"></script>',
    '<script src="js/perv-viewer-client.js"></script>',
    '<script>perv_client_data = ',JSON.stringify(client_data),'</script>',
    '</head><body><h1>lets have a perv</h1></body></html>',
  ].join('');

  res.send(body);
});

app.get('/day', function(req, res) {
  store.listDates(function(rows) {

    var dates = rows.map(function(row){
      return {
        url :'/day/' + [row.date.getFullYear(), row.date.getMonth()+1, row.date.getDate()].join('-')
      , date : row.date
      };
    });

    res.json(dates);

  });
});

app.get('/day/:date', function(req, res) {
  var date = req.params.date;
  store.getDay(date, function(data) {
    res.json(data);
  });
});

app.use(app.router);

app.listen(config.viewer_port);