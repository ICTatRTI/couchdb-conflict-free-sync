#!/usr/bin/env bash

PROCESS_NAME='conflict-free-sync'

set -e

docker build -t $PROCESS_NAME:local .

if [ ! -f a.state.json ]; then
  touch a.state.json
fi

if [ ! -f b.state.json ]; then
  touch b.state.json
fi

source ./config.sh

[ "$(docker ps | grep $PROCESS_NAME)" ] && docker stop $PROCESS_NAME
[ "$(docker ps -a | grep $PROCESS_NAME)" ] && docker rm $PROCESS_NAME

docker run -d \
   -e A_DB_URL="$A_DB_URL" \
   -e A_DB_STARTING_SEQUENCE="$A_DB_STARTING_SEQUENCE" \
   -e B_DB_URL="$B_DB_URL" \
   -e B_DB_STARTING_SEQUENCE="$B_DB_STARTING_SEQUENCE" \
   --link couchdb:couchdb \
   -v $(pwd)/a.state.json:/a.state.json \
   -v $(pwd)/b.state.json:/b.state.json \
   --name $PROCESS_NAME \
   $PROCESS_NAME:local
docker logs -f $PROCESS_NAME
