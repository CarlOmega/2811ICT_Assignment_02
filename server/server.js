const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbName = 'chatDatabase';
const path = require('path');
const app = express();
const fs = require('fs');
const dataFile = './data.json';
const dataFormat = 'utf8';


// CORS
// We are enabling CORS so that our 'ng serve' Angular server can still access
// our Node server.
const cors = require('cors');
var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));



// Body-Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic Routes
app.use(express.static(path.join(__dirname, '../chat-app/dist/angular-app')));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,'../chat-app/dist/angular-app/index.html'));
});
app.get('/home', function(req,res){
  res.sendFile(path.join(__dirname,'../chat-app/dist/angular-app/index.html'));
});
app.get('*', function(req, res) {
  res.sendfile(path.join(__dirname, '../chat-app/dist/angular-app/index.html'));
});


// Login Module
const login = require('./login.js')();
const groups = require('./groups.js')();

// create some test data
// mongodb.MongoClient.connect(url, {poolSize:10}, (err, client) => {
//   if (err) {
//     console.log(err);
//     res.status(500).end();
//   }
//   // Connected now setup db for query
//   const db = client.db(dbName);
//   db.collection("groups").drop();
//   db.collection("groups").insertOne(
//     {
//       name: "Group 01",
//       admins: ["super"],
//       members: ["super", "carl"],
//       channels: [{
//         name: "Channel 01",
//         members: ["super", "carl"],
//         history: ["hello"]
//       },{
//         name: "Channel 02",
//         members: ["carl"],
//         history: ["bye"]
//       }]
//     },
//     (err, res) => {
//       console.log(res);
//   });
//   client.close();
// });

app.post('/api/login', function(req, res){
  let username = req.body.username;
  let password = req.body.password;
  mongodb.MongoClient.connect(url, {poolSize:10}, (err, client) => {
    if (err) {
      console.log(err);
      res.status(500).end();
    }
    // Connected now setup db for query
  	const db = client.db(dbName);
    // find user with username x and password y
    db.collection("users").findOne({'username': username}, (err, result) => {
      if (result.password == password) {
        var query = {'members': username};
        if (result.permissions == 2) {
          query = {};
        }
        db.collection("groups").find(query).toArray((err, groups) => {
          if (err) {
            console.log(err);
            res.status(500).end();
          }
          result.groups = groups;
          for (var i = 0; i < groups.length; i++) {
            if (groups[i].admins.includes(result.username) || result.permissions == 2) {
              groups[i].role = 1;
            } else {
              groups[i].role = 0;
            }
          }
          res.send(result);
          client.close();
        });
      } else {
        res.send(false);
        client.close();
      }
    });

  });
});


// Group APIs
app.post('/api/groups', function(req,res){
    // We want to authenticate again -- usually you'd use a token
    let username = req.body.username;
    mongodb.MongoClient.connect(url, {poolSize:10}, (err, client) => {
      if (err) {
        console.log(err);
        res.status(500).end();
      }
      // Connected now setup db for query
    	const db = client.db(dbName);
      // find user with username x and password y
      db.collection("groups").find({'members': username}).toArray((err, groups) => {
        if (err) {
          console.log(err);
          res.status(500).end();
        }
        console.log(groups);
        res.send(groups);
        client.close();
      });
    });
});

app.delete('/api/group/delete/:groupname', function(req, res){
    let groupName = req.params.groupname;
    mongodb.MongoClient.connect(url, {poolSize:10}, (err, client) => {
      if (err) {
        console.log(err);
        res.status(500).end();
      }
      // Connected now setup db for query
    	const db = client.db(dbName);
      // find user with username x and password y
      db.collection("groups").deleteOne({'name':groupName}, (err, groups) => {
        if (err) {
          console.log(err);
          res.status(500).end();
        }
        console.log("Deleted group");
        res.send(true);
        client.close();
      });
    });

});

app.post('/api/group/create', function(req, res){
    let groupName = req.body.newGroupName;
    let username = req.body.username;
    if(groupName == '' || groupName == 'undefined' || groupName == null){
        res.send(false);
    } else {
        // Read the JSON file to get an updated list of groups
        mongodb.MongoClient.connect(url, {poolSize:10}, (err, client) => {
          if (err) {
            console.log(err);
            res.status(500).end();
          }
          // Connected now setup db for query
          const db = client.db(dbName);
          let newGroup = {
            name: groupName,
            admins: [username],
            members: [username],
            channels: []
          };
          db.collection("groups").insertOne(newGroup, (err, result) => {
              console.log("Created group");
              newGroup.role = 1;
              res.send(newGroup);
          });
          client.close();
        });
    }
});

app.post('/api/channel/create', function(req, res){
    let groupName = req.body.groupName;
    let username = req.body.username;
    let channelName = req.body.newChannelName;
    if(channelName == '' || channelName == 'undefined' || channelName == null){
        res.send(false);
    } else {
        // Read the JSON file to get an updated list of groups
        mongodb.MongoClient.connect(url, {poolSize:10}, (err, client) => {
          if (err) {
            console.log(err);
            res.status(500).end();
          }
          // Connected now setup db for query
          const db = client.db(dbName);
          let newChannel = {
            name: channelName,
            members: [username],
            history: []
          };
          db.collection("groups").updateOne({'name': groupName}, {$push: {channels: newChannel}}, (err, result) => {
              console.log("Created group");
              res.send(newChannel);
          });
          client.close();
        });
    }
});



// HTTP Listener
app.listen(3000, function(){
    console.log('Server runing');
})
module.exports = app;
