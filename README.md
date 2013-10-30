## perv
perv watches your project directories and logs events to help you keep track
of your time. data can be stored in a mysql or sqlite database. it relies on
inotify so it only works on linux.

to get started, run `npm install`. if using sqlite also run `npm install sqlite3`.
if using mysql create an empty database to use for storage. copy either
`default-mysql.config.json` or `default-sqlite.config.json` to `config.json`, 
editing it to contain access details for your database, an array of [minimatch](https://github.com/isaacs/minimatch) path patterns for files and directories you want to watch, and also 
the port you want the 'viewer' web app to run on.

to begin logging events, run 'node perv-watcher.js'. to view logged events,
run 'node perv-viewer.js' and point your web browser to the machine and port
you're running the viewer on. by default that would be [http://localhost:8080/](http://localhost:8080/)

