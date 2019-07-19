#!/bin/bash
COURSEID=$1

if [ $# -lt 1  ]; then
  echo -e "\033[1mERROR: \033[0mIncorrect number of arguments."
  echo "Usage:"
  echo -e "\t./add-toolbar-button.sh <COURSE ID>"
  exit 1
elif ! [[ $COURSEID =~ ^[0-9]+$ ]]; then
  echo -e "\033[1mERROR: \033[0mArgument is not a number."
  echo "Usage:"
  echo -e "\t./add-toolbar-button.sh <COURSE ID>"
  exit 1
fi

  echo -e "Attempting to add button to course: ${COURSEID}"
  TOKEN=`cat ./.canvas-access-token`
  KEY=`cat ./.my-key`
  SECRET=`cat ./.my-secret`
  curl --request POST \
    --url https://replace.me.canvas/api/v1/courses/${COURSEID}/external_tools \
    --header "Authorization: Bearer ${TOKEN}" \
    --header 'Content-Type: application/json' \
    --header 'cache-control: no-cache' \
    --data '{"name": "Insert Poll","consumer_key": "'${KEY}'","shared_secret": "'${SECRET}'","text": "Insert Poll","url": "https://replace.me.insertpoll/insertpoll/api/launch","privacy_level": "public","editor_button": {"url": "https://replace.me.insertpoll/insertpoll/api/launch","enabled": true,"icon_url": "https://cdn2.iconfinder.com/data/icons/gnomeicontheme/16x16/stock/object/stock_3d-light-off.png"},"custom_fields": {	"activity_url": "https://replace.me.insertpoll/insertpoll/"} }'
