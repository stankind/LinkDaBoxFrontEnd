@echo off

:: Create a package.json
:: call npm init -y

:: Download & install packages, add entries to package.json
call npm install webpack webpack-dev-server --save
call npm install babel-core babel-loader babel-preset-es2015 babel-preset-react --save
call npm install node-libs-browser eslint eslint-loader eslint-plugin-react --save
call npm install immutable --save
call npm install react react-dom react-router draft-js --save
call npm install redux react-redux --save
call npm install express --save

echo Now, edit package.json and add a script: "start": "webpack-dev-server --display-error-details --config webpack.config.js"

pause
