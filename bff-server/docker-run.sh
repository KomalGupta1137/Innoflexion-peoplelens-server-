#!/bin/bash
if [ "$NODE_ENV" == "test" ]
then
  sleep 30 #Wait for privacy API to start
  npm run watch:test
else
  npm run watch:build
fi
