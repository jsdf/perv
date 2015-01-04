var chokidar = require('chokidar')

var args = require('./args')
var store = require('./store')

var ignoredExtensions = /.tmp$/

function watch() {
  var watcher = chokidar.watch(args.watch, {ignored: /[\/\\]\./, persistent: true})

  watcher.on('change', function(path, stats) {
    if (path && path.match && path.match(ignoredExtensions)) return
    store.recordEvent({
      type: 'change',
      path: path,
    })
  })
}

module.exports = watch

