module.exports = function(app, io) {
  io.on('connection', (socket) => {
    console.log("User has connected");
    
  });
}
