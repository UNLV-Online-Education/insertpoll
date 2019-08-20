#!/bin/bash
COURSEID=$1
CONFIG_FILE=$2

if [ $# -lt 2  ]; then
  echo -e "\033[1mERROR: \033[0mIncorrect number of arguments."
  echo "Usage:"
  echo -e "\t./add-toolbar-button.sh <COURSE ID> <Config File>"
  exit 1
elif ! [[ $COURSEID =~ ^[0-9]+$ ]]; then
  echo -e "\033[1mERROR: \033[0mArgument is not a number."
  echo "Usage:"
  echo -e "\t./add-toolbar-button.sh <COURSE ID> <CONFIG FILE>"
  exit 1
elif ! [ -f "$CONFIG_FILE" ]; then
  echo -e "\033[1mERROR: \033[0mCould not find config file: $CONFIG_FILE"
  echo "Usage:"
  echo -e "\t./add-toolbar-button.sh <COURSE ID> <CONFIG FILE>"
  exit 1
fi

  . $CONFIG_FILE

  echo -e "Attempting to add button to course: ${COURSEID}"
  curl --request POST \
    --url $CANVAS_URL/api/v1/courses/${COURSEID}/external_tools \
    --header "Authorization: Bearer ${TOKEN}" \
    --header 'Content-Type: application/json' \
    --header 'cache-control: no-cache' \
    --data '{"name": "Insert Poll","consumer_key": "'${KEY}'","shared_secret": "'${SECRET}'","text": "Insert Poll","url": "'${TOOL_URL}'api/launch","privacy_level": "public","editor_button": {"url": "'${TOOL_URL}'api/launch","enabled": true,"icon_url": "https://cdn2.iconfinder.com/data/icons/gnomeicontheme/16x16/stock/object/stock_3d-light-off.png"},"custom_fields": {	"activity_url": "'${TOOL_URL}'"} }'
