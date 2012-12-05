var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));

var PervStore = require('./perv-store.js');

var config = require('./config.json');

var store = new PervStore(config.database);

app.get('/', function(req, res) {
  var body = '<html><head>'
    +'<title>perv viewer</title>'
    +'<script src="js/jquery-1.8.2.js"></script>'
    +'<script src="js/perv-viewer-client.js"></script>'
    +'</head><body>hello</body></html>';

  res.send(body);
});

app.get('/day', function(req, res) {
  store.listDates(function(rows) {

    var dates = rows.map(function(row){
      var date = [row.date.getFullYear(), row.date.getMonth()+1, row.date.getDate()].join('-');
      return {
        url :'/day/' + date
      , date : date
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