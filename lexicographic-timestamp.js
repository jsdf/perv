
// this will be incorrect for dates after 5138-11-16
// hopefully you've got something better to use by then
var padding = '000000000000000'

// returns a string version of the time, padded with zeros at the start to 
// ensure that when sorted lexicographically, chronological order is maintained
function lexicographicTimestamp(time) {
  return String(padding + time.toString()).slice(-padding.length)
}

module.exports = lexicographicTimestamp
