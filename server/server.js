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
const formidable = require('formidable');

const http = require('http');
const server = http.Server(app);
const socketIO = require('socket.io');
const io = socketIO(server);
require('./socket.js')(app, io, mongodb);

// CORS
// We are enabling CORS so that our 'ng serve' Angular server can still access
// our Node server.
const cors = require('cors');
var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true
}
app.use(cors(corsOptions));


// Body-Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/messageimages', express.static(path.join(__dirname, './images/messageimages')));
//app.user('/messageimages', express.static(path.join(__dirname, './images/messageimages')));
// Basic Routes
app.use(express.static(path.join(__dirname, '../chat-app/dist/chat-app')));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,'../chat-app/dist/chat-app/index.html'));
});
app.get('/home', function(req,res){
  res.sendFile(path.join(__dirname,'../chat-app/dist/chat-app/index.html'));
});

// Login Module
const login = require('./login.js')();
const groups = require('./groups.js')();

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


app.post('/api/upload', function(req,res) {
  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {
    var oldpath = files.image.path;
    var newpath = './images/messageimages/' + files.image.name;
    fs.copyFile(oldpath, newpath, function (err) {
      if (err) throw err;
      //build
      console.log("uploaded");
      console.log(path.join(files.image.name));
      res.send({url: path.join(files.image.name)});
    });
  });
});

app.post('/api/user/changeimage', function(req,res) {
  let username = req.body.username;
  let newUrl = req.body.url;
  mongodb.MongoClient.connect(url, {poolSize:10}, (err, client) => {
    if (err) {
      console.log(err);
      res.status(500).end();
    }
    // Connected now setup db for query
    const db = client.db(dbName);
    // find user with username x and password y
    db.collection("users").updateOne({'username': username}, {$set: {profile: newUrl}}, (err, groups) => {
      if (err) {
        console.log(err);
        res.status(500).end();
      }
      console.log(newUrl);
      res.send({url: newUrl});
      client.close();
    });
  });
});

app.get('/api/getusers', function(req, res){
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
    db.collection("users").find({}).toArray((err, result) => {
      if (err) {
        console.log(err);
        res.status(500).end();
      }
      res.send(result);
      console.log(result);
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

      db.collection("users").findOne({'username': username}, (err, result) => {
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

app.delete('/api/channel/delete/', function(req, res){
    let channelName = req.query.channelName;
    let groupName = req.query.groupName;
    console.log(channelName+ " " + groupName);
    mongodb.MongoClient.connect(url, {poolSize:10}, (err, client) => {
      if (err) {
        console.log(err);
        res.status(500).end();
      }
      // Connected now setup db for query
    	const db = client.db(dbName);
      // find user with username x and password y
      db.collection("groups").update({'name':groupName}, {$pull: {channels: {name: channelName}}}, (err, groups) => {
        if (err) {
          console.log(err);
          res.status(500).end();
        }
        console.log("Deleted Channel");
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

          db.collection("groups").findOne({name: newGroup.name}, (err, result) => {
            if (result) {
              console.log("Group already made");
              res.send(false);
            } else {
              db.collection("groups").insertOne(newGroup, (err, result) => {
                  console.log("Created group");
                  newGroup.role = 1;
                  res.send(newGroup);
                  client.close();
              });
            }
          });

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
          db.collection("groups").findOne({'name': groupName, "channels.name": channelName}, (err, result) => {
            if (result) {
              console.log("Channel already made");
              res.send(false);
            } else {
              db.collection("groups").updateOne({'name': groupName} , {$push: {channels: newChannel}}, (err, result) => {
                  console.log("Created channel");
                  res.send(newChannel);
                  client.close();
              });
            }
          });

        });
    }
});


app.post('/api/user/create', function(req, res){
  let newUser = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    permissions: 0
  }
  mongodb.MongoClient.connect(url, {poolSize:10}, (err, client) => {
    if (err) {
      console.log(err);
      res.status(500).end();
    }
    // Connected now setup db for query
    const db = client.db(dbName);
    db.collection("users").findOne({username: newUser.username}, (err, result) => {
      if (result) {
        console.log("User taken");
        console.log(result);
        res.send(false);
      } else {
        db.collection("users").insertOne(newUser, (err, ress) => {
          if (err) {
            console.log(err);
          }
          console.log(newUser);
          res.send(newUser);
          client.close();
        });
      }
    });

  });
});

app.post('/api/user/change', function(req, res){
  let type = req.body.type;
  let username = req.body.username;
  let groupName = req.body.groupName;
  let channelName = req.body.channelName;

  mongodb.MongoClient.connect(url, {poolSize:10}, (err, client) => {
    if (err) {
      console.log(err);
      res.status(500).end();
    }
    // Connected now setup db for query
    const db = client.db(dbName);

    if (type == "add") {
      if (channelName) {
        db.collection("groups").updateOne({'name': groupName, "channels.name": channelName} , {$push: {"channels.$.members": username}}, (err, result) => {
            console.log("Added user to channel");
            res.send(true);
        });
      } else {
        db.collection("groups").updateOne({'name': groupName} , {$push: {members: username}}, (err, result) => {
            console.log("Added user");
            res.send(true);
        });
      }
    }
    if (type == "kick") {
      if (channelName) {
        db.collection("groups").updateOne({'name': groupName, "channels.name": channelName} , {$pull: {"channels.$.members": username}}, (err, result) => {
            console.log("Kicked user from channel");
            res.send(true);
        });
      } else {
        db.collection("groups").updateOne({'name': groupName} , {$pull: {members: username}}, (err, result) => {
            console.log("Kicked user");
            res.send(true);
        });
      }
    }
    if (type == "promote") {
      db.collection("groups").updateOne({'name': groupName} , {$push: {admins: username}}, (err, result) => {
          console.log("Promoted user");
          res.send(true);
      });
    }
    if (type == "demote") {
      db.collection("groups").updateOne({'name': groupName} , {$pull: {admins: username}}, (err, result) => {
          console.log("Demoted user");
          res.send(true);
      });
    }
    client.close();
  });
});

app.delete('/api/user/delete/:id', function(req, res){
    let id = req.params.id;
    mongodb.MongoClient.connect(url, {poolSize:10}, (err, client) => {
      if (err) {
        console.log(err);
        res.status(500).end();
      }
      // Connected now setup db for query
    	const db = client.db(dbName);
      db.collection("users").deleteOne({_id: new mongodb.ObjectId(id)}, (err, user) => {
        if (err) {
          console.log(err);
          res.status(500).end();
        }
        console.log(user);
        res.send(true);
        client.close();
      });
    });
});


app.get('*', function(req, res) {
  res.sendfile(path.join(__dirname, '../chat-app/dist/chat-app/index.html'));
});


// HTTP Listener
server.listen(3000, function(){
    console.log('Server runing');
})
module.exports = app;
