const express = require('express')
const app = express()
const router = express.Router()

const rateLimit = require('./RateLimit')

require('./routes')(router);
require('./routes/events')(router);
require('./routes/stats')(router);
require('./routes/poi')(router);

// enable rate limiting
app.use(rateLimit)
// enable router
app.use('/', router);

// start express server
app.listen(process.env.PORT || 5555, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  } else {
    console.log(`Running on ${process.env.PORT || 5555}`)
  }
})


// last resorts
process.on('uncaughtException', (err) => {
  console.log(`Caught exception: ${err}`)
  process.exit(1)
})
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
  process.exit(1)
})
