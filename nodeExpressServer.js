#!/usr/bin/env nodejs

var path    = require('path');
var express = require('express');
var http    = require('http');

const app           = express(),  
      DIST_DIR      = path.join(__dirname, "dist"),
      HTML_FILE     = path.join(DIST_DIR, "index.html"),
      isDevelopment = process.env.NODE_ENV !== "production",
      DEFAULT_PORT  = 8080;

console.log('NODE_ENV = ' + process.env.NODE_ENV);

app.set("port", process.env.PORT || DEFAULT_PORT);
  
app.use(express.static(DIST_DIR));

app.get("*", (req, res) => res.sendFile(HTML_FILE));

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});