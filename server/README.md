## Development
This LTI launch point has a Key and a Secret. Create a config file called config.json based off of the one in example.config.json file.

lti-authorization-url is the url that the launched app will call back to ask for the LTI information about the user who launched the app.

## Testing/Debug Mode
Testing will disregard LTI signing, allowing you to simple pass the parameters you want for testing, without OAUTH signatures. CONFIG_PATH determines which configuration file is loaded. By default the production file config.json is loaded. Specify a different file for development so that the callback url matches the url of your development node instance.
### nodemon
$ DEBUG=true CONFIG_PATH="./dev.config.json" nodemon index.js
### pm2 (with debug mode on)
$ pm2 start index.js --node-args "DEBUG=true" 

if you are creating the pm2 instance from scratch, you need to first run it from inside the node-lti root directory. This will set the path correctly to the config.json. correct default is:
$ PORT=1338 pm2 start index.js --name node-lti