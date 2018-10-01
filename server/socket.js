module.exports = function(app, io, mongodb) {
  let rooms = {};
  io.on('connection', (socket) => {
    console.log("User has connected");

    socket.on('disconnect', () => {
      console.log('User has disconnected');
      socket.disconnect();
    });

    socket.on('join room', (data) => {
      console.log(data.username, " connected to:", data.room);
      socket.join(data.room);
      if (rooms[data.room] == null) {
        rooms[data.room] = [];
      }
      for (var i=0; i < rooms[data.room].length; i++) {
          if (rooms[data.room][i] === data.username) {
              rooms[data.room].splice(i, 1);
          }
      }
      rooms[data.room].push(data.username);
      io.to(data.room).emit('user', rooms[data.room]);
    });

    socket.on('leave room', (data) => {
      console.log(data.username," left:", data.room);
      socket.leave(data.room);
      if (rooms[data.room] == null) {
        rooms[data.room] = [];
      }
      for (var i=0; i < rooms[data.room].length; i++) {
          if (rooms[data.room][i] === data.username) {
              rooms[data.room].splice(i, 1);
          }
      }
      io.to(data.room).emit('user', rooms[data.room]);
    });

    socket.on('message', (message) => {
      console.log("Got message");
      console.log(message);
      let room = message.room;
      let group = message.group;
      io.to(room).emit('message', message);
      mongodb.MongoClient.connect('mongodb://localhost:27017', {poolSize:10}, (err, client) => {
        if (err) {
          console.log(err);
          res.status(500).end();
        }
        // Connected now setup db for query
        const db = client.db('chatDatabase');
        db.collection("groups").updateOne({'name': group, "channels.name": room} , {$push: {"channels.$.history": message}}, (err, result) => {
            console.log("Pushed message");
        });
        client.close();
      });
    });

  });
}
