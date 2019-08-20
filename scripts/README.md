The add-toolbar-button.sh can add InsertPoll to the Canvas Rich Content Editor for a course shell. The script helps you access the Canvas API to provide all the correct parameters to add the InsertPoll to the editor. The bulk of the script is just a well formatted cURL command using the parameters supplied in the configuration file.

## USAGE
You will need a [canvas API access token](https://community.canvaslms.com/docs/DOC-16005-42121018197) to use this script. 

Copy the `example.config.conf` file to a new location, for example, `~/.insertpoll-config`, and add your configuration details.

| Parameter | Description | Example |
|---|---|---|
| CANVAS_URL | Your Canvas URL | `https://school-name.instructure.com` |
 TOKEN | Canvas API Token | `1081~28aqoihasfA183ajHAfl73108a0foinweJaf` |
| KEY |LTI Key (must match key used in your InsertPoll server configuration) | `Key01` |
| SECRET | LTI Secret (same as in server configuration) | `UnguessableSecretForLTI` |
| TOOL_URL | URL where InsertPoll server is installed (do not include /api/launch) | `https://myserver.school.edu/insertpoll` |

*Note:* The LTI Key and Secret need to match the configuration for the InsertPoll `server/` part of the project.

```$ bash add-toolbar-button.sh <canvas course id> <config file location>```