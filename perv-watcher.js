var sys = require('sys')
var fs = require('fs')
var exec = require('child_process').exec;
var Inotify = require('inotify-plusplus');

var PervStore  = require('./perv-store.js');

var config = require('./config.json');
var store = new PervStore(config.database);
var base_watch_path = config.watch_path || '~/sites';


// GENERIC FIND
// find all directories recursively under a base path, returning an array of paths
function perv_find_paths(base_path, callback) {
  var find_command = 'find ' + base_watch_path + ' -type d ! -path \*.git\*';
  var paths_find_process = exec(find_command, {maxBuffer: 1024*1024*1024}, function (error, stdout, stderr) {
    if (error) {
      callback(error);
    } else {
      // transform stdout into an array of paths
      var paths = stdout.split('\n').filter(function(line){
        return line.search(/[!-~]/) > -1; //filter stdout cruft
      });
      callback(null, paths);
    }
  });
}

// GENERIC WATCH
// set up watchers for an array of paths
function perv_watch(watch_paths, event_callback) {
  var inotify = Inotify.create(true); // stand-alone, persistent mode, runs until you hit ctrl+c

  var watch_options = {
    all_events_is_catchall: true // by default (false) "all_events" only catches events already listened for.
                                 // this option tells "all_events" to catch all events, period.
  , onlydir: true
  }
  var watch_directive = {
    close_write: event_callback,
    modify: event_callback,
    moved_from: true
  }

  var new_watch = function(path) {
    try {
      inotify.watch(watch_directive, path, watch_options);
    } catch (e) {
      console.error(e);
    }
  }

  watch_directive.create = function(ev) {
    var path = ev.watch+'/'+ev.name;
    fs.stat(path, function(err, stats) {
      if (err) console.error(err);
      else if (stats.isDirectory()) new_watch(path);
    });
  };

  watch_paths.forEach(new_watch);
}


// APP
perv_find_paths(base_watch_path, function(error, watch_paths){
  if (error) {
    console.error('error finding directories to watch');
    console.error(error);
  } else {
    console.log(watch_paths.length + ' paths found, starting to watch')
    perv_watch(watch_paths, function log_event(ev) {
      // ignore temporary files
      if (ev.name.indexOf('.tmp', ev.name.length - 4) > -1) return;
      store.write(ev);
    });
  }
});
