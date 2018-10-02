const mocha = require('mocha');
const assert = require('assert');
const mongodb = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbName = 'testDatabase';

describe('MongoDB tests', function() {

  //Clear database first
  mongodb.MongoClient.connect(url, {useNewUrlParser: true }, {poolSize:10}, (err, client) => {
    const db = client.db(dbName);
    db.collection("users").drop((err, res) => {client.close();});
    db.collection("groups").drop((err, res) => {client.close();});
  });

  //Connection code
  describe('Testing connecting to server', function() {
    it('should have no errors', function() {
      mongodb.MongoClient.connect(url, {useNewUrlParser: true }, {poolSize:10}, (err, client) => {
        const db = client.db(dbName);
        assert.equal(null, err);
        assert.notEqual(null, db);
        client.close();
      });
    });
  });
  // API create user code
  describe('Testing creatation of user', function() {
    describe('Testing creatation of new user', function() {
      it('should have stored the information correctly', function() {
        let newUser = {
          username: 'super',
          email: 'super@super.com',
          password: '1234',
          permissions: 2
        }
        mongodb.MongoClient.connect(url, {useNewUrlParser: true }, {poolSize:10}, (err, client) => {
          const db = client.db(dbName);
          db.collection("users").insertOne(newUser, (err, res) => {
            assert.equal(null, err);
            db.collection("users").findOne({username: newUser.username}, (err, user) => {
              assert.equal(user.username, newUser.username);
              assert.equal(user.email, newUser.email);
              assert.equal(user.password, newUser.password);
              assert.equal(user.permissions, newUser.permissions);
              client.close();
            });
          });
        });
      });
    });

    describe('Testing creatation of exsisting user', function() {
      it('should have errored and not created new user', function() {
        let newUser = {
          username: 'super',
          email: 'super@super.com',
          password: '1234',
          permissions: 2
        }
        mongodb.MongoClient.connect(url, {useNewUrlParser: true }, {poolSize:10}, (err, client) => {
          const db = client.db(dbName);
          db.collection("users").findOne({username: newUser.username}, (err, user) => {
            assert.equal(null, user);
            client.close();
          });
        });
      });
    });

    describe('Testing getting all users', function() {
      it('should have no errors and get all users', function() {
        let user = {
          username: 'super',
          email: 'super@super.com',
          password: '1234',
          permissions: 2
        }

        mongodb.MongoClient.connect(url, {useNewUrlParser: true }, {poolSize:10}, (err, client) => {
          const db = client.db(dbName);
          db.collection("users").find({}).toArray((err, users) => {
            assert.equal(null, err);
            //Make sure the one user is stored
            assert.equal(user.username, users[0].username);
            assert.equal(user.email, users[0].email);
            assert.equal(user.password, newUsusers[0].password);
            assert.equal(user.permissions, users[0].permissions);
            client.close();
          });
        });
      });
    });
  });

  //login tests
  describe('Testing login of user', function() {
    describe('Testing correct password of user', function() {
      it('should have no errors', function() {
        let testUser = {
          username: 'super',
          password: '1234',
        }
        mongodb.MongoClient.connect(url, {useNewUrlParser: true }, {poolSize:10}, (err, client) => {
          const db = client.db(dbName);

          db.collection("users").findOne({username: testUser.username}, (err, user) => {
            assert.equal(testUser.password, user.password);
            client.close();
          });
        });
      });
    });

    describe('Testing incorrect password of user', function() {
      it('should have errors', function() {
        let user = {
          username: 'super',
          password: '12421',
        }
        mongodb.MongoClient.connect(url, {useNewUrlParser: true }, {poolSize:10}, (err, client) => {
          const db = client.db(dbName);

          db.collection("users").findOne({username: testUser.username}, (err, user) => {
            assert.notEqual(testUser.password, user.password);
            client.close();
          });
        });
      });
    });
  });


  describe('Testing creatation of group', function() {
    describe('Testing creatation of new group', function() {
      it('should have no errors and correctly stored data', function() {
        let newGroup = {
          name: 'Group 01',
          admins: ['super'],
          members: ['super'],
          channels: []
        };
        mongodb.MongoClient.connect(url, {useNewUrlParser: true }, {poolSize:10}, (err, client) => {
          const db = client.db(dbName);
          db.collection("groups").insertOne(newGroup, (err, result) => {
            assert.equal(null, err);
            db.collection("groups").findOne({name: newGroup.name}, (err, group) => {
              assert.equal(group.name, newGroup.name);
              assert.equal(group.admins, newGroup.admins);
              assert.equal(group.members, newGroup.members);
              assert.equal(group.channels, newGroup.channels);
              client.close();
            });
          });
        });
      });
    });
    describe('Testing creatation of exsisting group', function() {
      it('should have errors', function() {
        let newGroup = {
          name: 'Group 01',
          admins: ['super'],
          members: ['super'],
          channels: []
        };
        mongodb.MongoClient.connect(url, {useNewUrlParser: true }, {poolSize:10}, (err, client) => {
          const db = client.db(dbName);
          db.collection("groups").findOne({name: newGroup.name}, (err, group) => {
            assert.equal(null, group);
            client.close();
          });
        });
      });
    });
  });


  describe('Testing creatation of channel', function() {
    describe('Testing creatation of new channel', function() {
      it('should have no errors and correctly stored data', function() {
        let groupName = 'Group 01';
        let newChannel = {
           name: 'Channel 01',
           members: ['super'],
           history: []
         };
         mongodb.MongoClient.connect(url, {useNewUrlParser: true }, {poolSize:10}, (err, client) => {
           const db = client.db(dbName);
           db.collection("groups").updateOne({'name': groupName} , {$push: {channels: newChannel}}, (err, result) => {
             assert.equal(null, err);
             db.collection("groups").findOne({'name': groupName, "channels.name": newChannel.name}, (err, channel) => {
               assert.equal(channel.name, newChannel.name);
               assert.equal(channel.members, newChannel.members);
               assert.equal(channel.history, newGroup.history);
               client.close();
             });
           });
         });
      });
    });
    describe('Testing creatation of exsisting channel', function() {
      it('should have errors', function() {
        let groupName = 'Group 01';
        let newChannel = {
           name: 'Channel 01',
           members: ['super'],
           history: []
         };
         mongodb.MongoClient.connect(url, {useNewUrlParser: true }, {poolSize:10}, (err, client) => {
           const db = client.db(dbName);
           db.collection("groups").findOne({'name': groupName, "channels.name": channelName}, (err, channel) => {
             assert.equal(null, channel);
             client.close();
           });
         });
      });
    });
  });
});
