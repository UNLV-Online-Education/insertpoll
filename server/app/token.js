var jwt = require('jsonwebtoken')
var appConfig = require('config').get('app')
module.exports = function() {
  return {
    verify: function(req, res, next) {
      ;(function(authToken) {
        console.log(authToken)
        if (authToken) {
          jwt.verify(authToken, appConfig.jwtSecret, function(err, decoded) {
            if (err) {
              console.log(new Date(), '--- auth token invalid, no access.')
              return res.json({
                success: false,
                message: 'Access invalid.'
              })
            } else {
              console.log(new Date(), '--- auth token valid.')
              req.authToken = authToken
              req.decoded = decoded
              next()
            }
          })
        } else {
          console.log(new Date(), '--- no auth token, no access.')
          return res.json({
            success: false,
            message: 'Access denied.'
          })
        }
      })(req.headers.authorization)
    }
  }
}
