//Use app in strict mode
'use strict';
//Using actions on google library
const {
  dialogflow,
} = require('actions-on-google');

const express = require('express');
var story_text= "hello";

var fs = require('fs')
fs.readFile('story.txt', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
  story_text=data;
});

var bodyParser = require('body-parser');
var cors = require('cors');
var request = require("request");

const app = dialogflow({debug: true});
const expressApp = express();
expressApp.use(express.static(__dirname));

var PORT = process.env.PORT || 9000;

expressApp.use(bodyParser());
expressApp.use(bodyParser.json()); 
expressApp.use(cors());

var PAUSE = false;
var last_data = [];
var dummy = [{temp:0, time: get_time()},{temp:0, time: get_time()*1 + 10}];
expressApp.post('/fulfillment', app);

app.intent('readstory', (conv,{devicename}) => {
    var device_name = devicename;
    return new Promise((resolve, reject) => {
            if (0) {
                reject(conv.ask("I am not able to process it."));
            }
            else{
                resolve(conv.ask(story_text));
            }
           
  });
});


expressApp.get('/fetch',function(req, res) {
    res.send(story_text)
})

expressApp.listen(PORT, function(req, res) {
  console.log("Running server on port " +  PORT);
});


function get_time() {
  var dt = new Date();
  var h = dt.getHours();
  var m = dt.getMinutes();
  var s = dt.getSeconds();
  var time_decimal = (h+5 + (m+30)/60 + s/3600) % 24;
  return time_decimal.toFixed(4);
}
