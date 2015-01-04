var level = require('level')

var args = require('./args')
var timestamp = require('./lexicographic-timestamp')
var dateutil = require('./dateutil')

var maxDays = 30 // sane max days of data to fetch at once

module.exports = exports = {}

var db = exports.db = level(args.store, {
  valueEncoding: 'json',
})

exports.recordEvent = function(event) {
  db.put(timestamp(Date.now()), event)
}

exports.getEventsForDate = function(day, callback) {
  var day = new Date(day)
  var start = dateutil.startOfDay(day)
  var end = dateutil.endOfDay(day)
  db.createReadStream({
    start: timestamp(dateutil.startOfDay(day)),
    end: timestamp(end),
  }, callback)
}

exports.getEventsFromDate = function(day, days, callback) {
  // limit to max number of days, also use as default value
  var daysToFetch = Math.min(maxDays, (days || maxDays))

  var day = new Date(day)
  var start = dateutil.startOfDay(day)
  var end = dateutil.endOfDay(day) + daysToFetch*dateutil.millisecondsInADay
  db.createReadStream({
    start: timestamp(dateutil.startOfDay(day)),
    end: timestamp(end),
  }, callback)
}