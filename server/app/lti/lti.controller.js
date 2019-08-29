var lti = require('ims-lti')
var fs = require('fs')
var jwt = require('jsonwebtoken')
var config = require('config')
var ltiConfig = config.get('lti')
var appConfig = config.get('app')
var developerOptions = config.get('developerOptions')
var oneTimeHash = new Map()

module.exports = {
  launch: function(req, res) {
    req.originalUrl = appConfig.basePath + 'api/launch'
    provider = new lti.Provider(ltiConfig.key, ltiConfig.secret)

    if (developerOptions.get('debugMode')) {
      console.log(new Date(), 'Headers', req.headers)
      console.log(new Date(), 'Body', req.body)
    }
    if (developerOptions.get('enableLtiTesting')) {
      console.log(new Date(), 'Skipped LTI Verification')
      launchLTIApp(req, res)
    } else {
      provider.valid_request(req, function(err, isValid) {
        if (isValid) {
          launchLTIApp(req, res)
        } else {
          err.timestamp = new Date().toString()
          console.log(err)
          res.json(err)
          res.end()
        }
      })
    }
  },

  ltiTestPage: function(req, res) {
    ltiTestPage(res, appConfig.basePath + 'api/launch')
  },

  getLTIPayload: function(req, res) {
    var hash = req.params.hash
    if (developerOptions.get('debugMode')) {
      console.log(new Date(), 'Looking up LTI Information.', hash)
    }
    var result = getObject(hash)
    if (!result) {
      res.json({
        message: 'Could not find LTI Payload. ' + hash,
        timestamp: new Date().toString()
      })
      if (developerOptions.get('debugMode')) {
        console.log(new Date(), 'LTI Payload not found.', hash)
      }
      res.end()
    } else {
      if (developerOptions.get('debugMode')) {
        console.log(new Date(), 'LTI Result: ', result)
      }
      res.json(result)
    }
  }
}

function launchLTIApp(req, res) {
  var hashForRecord = parseAndSaveDataObject(req.body)
  // blackboard adds 'custom_' to any custom (non-LTI) parameters'
  var redirectUrl
  if (
    typeof req.body.pollId == 'undefined' ||
    req.body.pollId.trim().length == 0
  ) {
    redirectUrl = appConfig.basePath + 'insert?hash=' + hashForRecord
  } else {
    redirectUrl =
      appConfig.basePath +
      'embed?hash=' +
      hashForRecord +
      '&pollId=' +
      req.body.pollId
  }
  if (developerOptions.get('debugMode')) {
    console.log('Redirecting: ' + redirectUrl)
  }
  // Redirect to new Url
  res.writeHead(301, {
    Location: redirectUrl
  })
  res.end()
}

// function launchWithSampleData(req, res) {
//   var sampleData = JSON.parse(
//     fs.readFileSync('./sample-LTI-data/instructor-example.json', 'UTF-8')
//   )
//   req.body = sampleData
//   if (typeof req.query.pollId !== 'undefined') {
//     if (developerOptions.get('debugMode')) {
//       console.log('Using pollId: ' + req.query.pollId)
//     }
//     req.body.pollId = req.query.pollId
//   }
//   launchLTIApp(req, res)
// }

function ltiTestPage(res, launchUrl) {
  res.render('testLti.pug', {
    title: 'Hey',
    message: 'Hello there!',
    launchUrl: launchUrl
  })
}

function parseAndSaveDataObject(ltiData) {
  var publicData = {
    custom_canvas_course_id: ltiData.custom_canvas_course_id,
    context_title: ltiData.context_title,
    custom_canvas_user_id: ltiData.custom_canvas_user_id,
    lis_person_name_full: ltiData.lis_person_name_full,
    ext_content_return_url: ltiData.ext_content_return_url,
    roles: ltiData.roles
  }
  var tokenData = {
    custom_canvas_course_id: ltiData.custom_canvas_course_id,
    custom_canvas_user_id: ltiData.custom_canvas_user_id,
    roles: ltiData.roles
  }
  var hashForRecord = saveObjectWithToken(publicData, tokenData)
  return hashForRecord
}

function makeToken(tokenData) {
  var token = jwt.sign(tokenData, appConfig.jwtSecret, {
    expiresIn: 30 * 60
  })
  return token
}

function saveObjectWithToken(publicData, tokenData) {
  publicData._time = Date.now()
  publicData.token = makeToken(tokenData)
  var hash = require('crypto')
    .createHash('md5')
    .update(JSON.stringify(publicData))
    .digest('hex')
  oneTimeHash.set(hash, publicData)
  if (developerOptions.get('debugMode')) {
    console.log('Launch. saved hash: ' + hash)
    console.log(new Date(), tokenData)
  }
  return hash
}

function getObject(lookup) {
  var recordToReturn = oneTimeHash.get(lookup)
  if (recordToReturn) {
    oneTimeHash.delete(lookup)
  }
  return recordToReturn
}
