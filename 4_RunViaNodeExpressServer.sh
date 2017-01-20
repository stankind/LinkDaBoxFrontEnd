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

npm run prod

echo "Now browse to http://<server ip address>/LinkDaBox"