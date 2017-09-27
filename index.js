'use strict';
require('dotenv').config();

var Alexa = require('alexa-sdk');

const moment = require('moment-timezone');

var MongoClient = require('mongodb').MongoClient
, assert = require('assert');

// Connection URL
var url = process.env.DB_CONNECTION;

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context, callback);
    alexa.registerHandlers(handlers);

    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {

        var alexa = this;

        // Use connect method to connect to the Server
        MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            console.log("Connected correctly to server");

            var item = db.collection('inserts').find().sort({"timestamp": -1}).limit(1).toArray(function(err, docs) {
                console.log(docs);

                var item = docs[0];
                console.log(item.timestamp);
                console.log(item.event);
    
                var momentLastTaken = moment(item.timestamp);
        
                db.close();
    
                alexa.emit(':tell', 'Hi! Brenda last took her tablets ' + momentLastTaken.fromNow() + '. Goodbye.');
            });   
        });
    }
};