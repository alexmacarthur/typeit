#!/bin/bash

DIST_PATH="$(pwd)/dist"
DIST_FILES=("index.umd.js" "index.es.js")

for f in "${DIST_FILES[@]}"
do
  echo -e "// TypeIt by Alex MacArthur - https://typeitjs.com\n$(cat $DIST_PATH/$f)" > $DIST_PATH/$f
done
