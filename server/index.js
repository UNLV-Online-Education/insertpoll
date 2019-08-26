lti = require('ims-lti')
var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser')
var path = require('path')
var config = require('config')
var developerOptions = config.get('developerOptions')

if (developerOptions.get('debugMode')) {
  console.log(config)
}

app.use(bodyParser.json()) // for parsing application/json
app.use(
  bodyParser.urlencoded({
    extended: true
  })
) // for parsing application/x-www-form-urlencoded
app.use(logger)
app.use(express.static(path.join(__dirname, 'public')))

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api

var router = express.Router()
if (developerOptions.enableCORS) {
  console.log('CORS enabled.')
  router.use(cors())
}

var appRoutes = require('./app/app.routes')(express)

app.use('/api', appRoutes)

app.route('/*').all(function(req, res, next) {
  res.sendFile('index.html', {
    root: path.join(__dirname, 'public')
  })
})
app.enable('trust proxy')
app.use(router)

// START THE SERVER
// =============================================================================
var port = process.env.PORT || 3000
console.log('listening on port ' + port)
app.listen(port)

function logger(req, res, next) {
  console.log(
    new Date(),
    req.method,
    req.url,
    req.method == 'POST' ? req.body : req.query
  )
  next()
}
