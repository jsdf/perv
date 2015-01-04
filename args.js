var minimist = require('minimist')

args = minimist(process.argv.slice(2))

args.store = args.store || './store'
args.watch = args.watch || '~/code'
args.port = parseInt(args.port) || 3000

module.exports = args
