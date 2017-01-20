#!/bin/bash

echo

{
if [ ! -f ./dist/index.html ]; then
  cp ./index.html dist/.
  echo "Copied index.html into the dist directory."
else
  echo "index.html was already in the dist directory."
fi
}

{
if [ ! -f ./dist/bundle.js ]; then
  npm run build
}

echo
echo "Launching server.  Browse to http://<server ip address>/LinkDaBox"
echo

npm run prod-linux
