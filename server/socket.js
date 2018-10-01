module.exports = function(app, io) {
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
    })

  });
}
