var jwt = require('jsonwebtoken');
var options = require('../options');

module.exports = function () {
  return {
    verify: function (req, res, next) {
      (function (authToken) {
        console.log(authToken);
        if (authToken) {
          jwt.verify(authToken, options.jwtSecret, function (err, decoded) {
            if (err) {
              console.log(new Date(), '--- auth token invalid, no access.');
              return res.json({
                success: false,
                message: 'Access invalid.'
              });
            } else {
              console.log(new Date(), '--- auth token valid.');
              req.authToken = authToken;
              req.decoded = decoded;
              next();
            }
          });
        } else {
          console.log(new Date(), '--- no auth token, no access.');
          return res.json({
            success: false,
            message: 'Access denied.'
          });
        }
      })(req.headers.authorization);
    }
  }
}