
module.exports = {
  startOfDay: function(date) {
    return new Date(date).setHours(0,0,0,0)
  },
  endOfDay: function(date) {
    return new Date(date).setHours(23,59,59,999)
  },
  millisecondsInADay: 86400000,
}
