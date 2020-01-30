const MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

const uri = 'mongodb+srv://the_flash:dQln0M0MrQVbONaU@cluster0-5pniq.mongodb.net/test'

const dbName = 'db_the_flash';

MongoClient.connect(uri, function (err, client) {

  assert.equal(null, err);
  console.log("connected successfully to server");

  const db = client.db(dbName);
  
  db.createCollection("requests", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
  
    client.close();

  });


});
