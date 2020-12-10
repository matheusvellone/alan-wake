#!/bin/sh
MY_DIR=$(dirname $0)

$MY_DIR/node_modules/.bin/webpack --config webpack.config.js

$MY_DIR/node_modules/.bin/pm2 start $MY_DIR/pm2.config.js
