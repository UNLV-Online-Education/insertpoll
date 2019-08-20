var lti = require('ims-lti')
var fs = require('fs')
var jwt = require('jsonwebtoken')
var ltiConfig = require('config').get('lti')
var appConfig = require('config').get('app')
var developerOptions = require('config').get('developerOptions')

var oneTimeHash = new Map()

module.exports = {
  getLTIPayload: function(req, res) {
    var hash = req.params.hash
    console.log('looking up hash: ' + hash)
    var result = getObject(hash)
    if (!result) {
      res.json({
        message: 'Could not find hash ' + hash,
        timestamp: new Date().toString()
      })
      res.end()
    } else {
      res.json(result)
    }
  },
  launch: function(req, res) {
    req.originalUrl = appConfig.basePath + 'api/launch'
    provider = new lti.Provider(ltiConfig.key, ltiConfig.secret)

    if (developerOptions.get('outputLaunchRequests')) {
      console.log(req.headers)
      console.log(req.body)
    }
    if (developerOptions.get('skipLTIVerification')) {
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
  fakeLaunch: function(req, res) {
    launchWithCannedData(req, res)
  }
}

function launchLTIApp(req, res) {
  var hashForRecord = parseAndSaveDataObject(req.body)
  // blackboard adds 'custom_' to any custom (non-LTI) parameters'
  var redirectUrl
  if (typeof req.body.pollId !== 'undefined') {
    redirectUrl =
      appConfig.basePath +
      'embed?hash=' +
      hashForRecord +
      '&pollId=' +
      req.body.pollId
  } else {
    redirectUrl = appConfig.basePath + 'insert?hash=' + hashForRecord
  }

  console.log('Redirecting: ' + redirectUrl)
  // Redirect to new Url
  res.writeHead(301, {
    Location: redirectUrl
  })
  res.end()
}

function launchWithCannedData(req, res) {
  var sampleData = JSON.parse(
    fs.readFileSync('./cannedLTIPayload.json', 'UTF-8')
  )
  req.body = sampleData
  if (typeof req.query.pollId !== 'undefined') {
    console.log('Using pollId: ' + req.query.pollId)
    req.body.pollId = req.query.pollId
  }
  launchLTIApp(req, res)
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
  console.log('Launch. saved hash: ' + hash)
  console.log(new Date(), tokenData)
  return hash
}

function getObject(lookup) {
  var recordToReturn = oneTimeHash.get(lookup)
  if (recordToReturn) {
    oneTimeHash.delete(lookup)
  }
  return recordToReturn
}
