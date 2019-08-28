var lti = require('./lti/lti.controller')
var polls = require('./polls/polls.controller')
var developerOptions = require('config').get('developerOptions')

module.exports = function(express) {
  var token = require('./token')()

  var api = express.Router()

  // Canvas makes preliminary HTTP HEAD requests.
  api.head('/launch', function(req, res) {
    res.end()
  })

  // Recieve the LTI Launch, save the LTI Payload
  api.post('/launch', lti.launch)
  if (developerOptions.get('enableFakeLtiData')) {
    api.get('/launch', lti.fakeLaunch)
  }

  // Client retreives the LTI Payload
  api.get('/get/:hash', lti.getLTIPayload)

  // Protect API routes behind JWT verification.
  if (!developerOptions.get('skipJwtVerification')) {
    api.use(token.verify)
  }

  api.get('/polls/:poll_id', polls.getOne)
  api.post('/polls', polls.create)
  api.post('/polls/:poll_id/responses', polls.saveResponse)
  api.get('/polls/:poll_id/responses', polls.getResponseAggregate)
  api.get('/polls/:poll_id/responses/self', polls.getOwnResponse)

  return api
}
