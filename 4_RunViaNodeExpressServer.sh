#!/bin/bash

{
if [ ! -f ./dist/index.html ]; then
  cp ./index.html dist/.
  echo "Copied index.html into the dist directory."
else
  echo "index.html was already in the dist directory."
fi
}

# env NODE_ENV=production ./nodeExpressServer.js

echo "Launching server.  Browse to http://<server ip address>/LinkDaBox"

npm run prod