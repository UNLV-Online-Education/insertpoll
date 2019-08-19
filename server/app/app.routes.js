var oeLTI = require('./lti/lti.controller')
var polls = require('./polls/polls.controller')
var debug = require('config').get('debug')

module.exports = function(express) {
  var token = require('./token')()

  var api = express.Router()

  // Canvas makes preliminary HTTP HEAD requests.
  api.head('/launch', function(req, res) {
    res.end()
  })

  api.get('/get/:hash', oeLTI.getLTIPayload)
  api.post('/launch', oeLTI.launch)

  if (debug) {
    api.get('/launch', oeLTI.fakeLaunch)
  }

  // Protect API routes behind JWT verification.
  api.use(token.verify)

  api.get('/polls/:poll_id', polls.getOne)
  api.post('/polls', polls.create)
  api.post('/polls/:poll_id/responses', polls.saveResponse)
  api.get('/polls/:poll_id/responses', polls.getResponseAggregate)
  api.get('/polls/:poll_id/responses/self', polls.getOwnResponse)

  return api
}
