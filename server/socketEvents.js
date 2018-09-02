const socketEvents = io => {
  io.on('connect', socket => {
    console.log('socket connected ', socket.connected);

    socket.on('enterroom', cam => {
      socket.join(cam.id);
      console.log('entered stream ', cam);
      socket.room = cam.id;
      const room = io.sockets.adapter.rooms[socket.room];
      console.log('room ', room);
    });

    socket.on('leavestream', cam => {
      socket.leave(cam.id);
      console.log('leaving stream ', cam);
    });

    socket.on('streamerdescription', details => {
      io.sockets.in(details.cam.id).emit('streamerdescription', details.sdp);
      console.log('streamer description ', details.cam.id);
    });

    socket.on('recipientdescription', details => {
      io.sockets.in(details.cam.id).emit('recipientdescription', details.sdp);
      console.log('recipient description ', details.cam.id);
    });

    socket.on('icecandidate', details => {
      io.sockets.in(details.cam.id).emit('newice', details);
    });

    socket.on('closestream', cam => {
      io.of('/')
        .in(cam.id)
        .clients((error, clients) => {
          if (error) throw error;
          clients.forEach(client => {
            io.sockets.connected[client].leave(cam.id);
          });
        });
      io.sockets.in(cam.id).emit('streamclosed');
    });

    socket.on('disconnect', () => {
      console.log('socket disconnected ', socket.connected);
    });
  });
};

module.exports = socketEvents;
