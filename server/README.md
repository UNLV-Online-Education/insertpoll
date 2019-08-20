# Server for InsertPoll

The server handles is the LTI Provider, provides the API for the client pages, and statically serves the client pages to the user. The server is written javascript and is run using Node.js.

## Configuration

Create a config file called `config/production.json` based on the `config/example.production.json` file. Fill in values for your own environment. You can also create another config for `config/development.json` for development, etc. If you have a value in your `NODE_ENV` environment variable, the corresponding file will be used. If there is no value in `NODE_ENV`, then `config/development.json` will be used.

| Variable Name | Description                                                                                                                                                                            |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| basePath      | path to the server. If it is being served on the root of the domain use `/`. If server is located in a subpath (e.g. `https://example.com/insertpoll/`) then enter `/insertpoll`       |
| key           | Shared LTI Key used for Canvas to authenticate with the server.                                                                                                                        |
| secret        | Shared Secret used to sign launch requests from Canvas to this server.                                                                                                                 |
| jwtSecret     | Separate secret used to sign / verify JWT tokens between the client and the server. Use any long string of unguessable letters and numbers. _Should be different from the LTI Secret._ |
| host          | IP address or hostname of Database server. MAy use `localhost` or `127.0.0.1` if Database is co-located with the server.                                                               |
| schema        | Name of database schema that holds the tables for the application.                                                                                                                     |
| user          | Database username                                                                                                                                                                      |
| password      | Database password                                                                                                                                                                      |
| dialect       | )Use `mysql`, or some other [Sequelize dialect descriptor](https://sequelize.org/master/manual/dialects.html.                                                                          |
| debug         | `false` for running in production. `true` enables a canned LTI response, and outputs more debugging information to the console.                                                        |

## Running the Server

The server can be started in testing mode by just running `$ node index.js`. However, in production it is recommended to use a process runner like [PM2](http://pm2.keymetrics.io/), to ensure that the process continues to run even if an error occurs, and to handle logging of app output.

## Debug Mode

When using the setting `debug: true` you will see more logging output. This will also activate a new launch path which will let you test end to end launching of the app with simulated LTI data.

If you make a `GET` request to the `/api/launch` of the server in DebugMode the insertpoll app will be launched with the sample LTI data found in the file `sampleResponse.json`.

## Choosing config file

If you would like to use a different config file name than `config.json` then supply the `CONFIG_PATH` environment variable when starting the server. E.g. `CONFIG_PATH="./dev.config.json" node index.js`
