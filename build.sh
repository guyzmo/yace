#!/bin/sh

npm install
cd node_modules/twitter-bootstrap
npm install
make bootstrap
cd -
cd node_modules/jsrepl
cake bake
cd -
