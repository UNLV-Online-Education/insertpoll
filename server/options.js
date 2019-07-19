// options.js
var fs = require('fs'),
    configPath = process.env.CONFIG_PATH || './config.json';
console.log("loading config file: " + configPath);

var debugModeOn = process.env.DEBUG || false;
if (debugModeOn) {
    console.log("Debug Mode");
}

var parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));

exports.ltiUrl = parsed.ltiUrl;
exports.key = parsed.lti_key;
exports.secret = parsed.lti_secret;
exports.jwtSecret = parsed.jwt_secret;

exports.db_schema = parsed.db_schema;
exports.db_user = parsed.db_user;
exports.db_password = parsed.db_password;
exports.db_dialect = parsed.db_dialect;
exports.db_host = parsed.db_host;

exports.base_path = parsed.base_path;
exports.debugModeOn = debugModeOn || parsed.debugMode;