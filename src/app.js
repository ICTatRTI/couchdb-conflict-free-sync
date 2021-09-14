const init = require('./init.js')

init({
  url: process.env.A_DB_URL,
  sequence: process.env.A_DB_STARTING_SEQUENCE,
  actionPath: '/app/src/action.js',
  statePath: '/a.state.json',
  verbose: true,
  batchSize: 10,
  delayWhenNothingToProcess: 3*1000,
  delayBetweenBatches: 0
})

init({
  url: process.env.B_DB_URL,
  sequence: process.env.B_DB_STARTING_SEQUENCE,
  actionPath: '/app/src/action.js',
  statePath: '/b.state.json',
  verbose: true,
  batchSize: 10,
  delayWhenNothingToProcess: 3*1000,
  delayBetweenBatches: 0
})