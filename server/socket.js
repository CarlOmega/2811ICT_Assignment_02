module.exports = function(app, io, mongodb) {
  io.on('connection', (socket) => {
    console.log("User has connected");

    socket.on('disconnect', () => {
      console.log('User has disconnected');
      socket.disconnect();
    });

    socket.on('join room', (room) => {
      console.log("user connected to:", room)
      socket.join(room);
    });

    socket.on('leave room', (room) => {
      console.log("user left:", room)
      socket.leave(room);
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
