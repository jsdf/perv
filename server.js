var express = require('express')
var app = express()
app.use(express.static(__dirname + '/public'))

var args = require('./args')
var store = require('./store')

app.get('/', function(req, res) {
  var clientData = {
    watch: args.watch
  }

  var body = [
    '<html><head>',
    '<title>perv viewer</title>',
    '<link rel="stylesheet" type="text/css" href="/css/perv.css"></link>',
    '<script>',clientDataScript(clientData),'</script>',
    '</head><body><h1>lets have a perv</h1></body></html>',
  ].join('')

  res.send(body)
})


app.get('/day/:date', function(req, res) {
  var date = req.params.date
  store.getEventsForDate(date, function(data) {
    res.json(data)
  })
})

app.use(app.router)

app.listen(args.port)

// bootstrap initial data on client side
function clientDataScript(clientData) {
  return [
    'window.Perv = window.Perv || {};',
    'Perv.clientData = ',JSON.stringify(clientData),';'
  ].join('')
}