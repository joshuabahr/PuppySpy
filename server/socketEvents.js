const socketEvents = io => {
  io.on('connect', socket => {
    console.log('socket connected ', socket.connected);

    socket.on('allowaccess', (cam, data) => {
      socket.join(cam.id);
      socket.room = cam.id;
      const room = io.sockets.adapter.rooms[socket.room];
      io.sockets.in(cam.id).emit('allowedaccess', data);
    });

    socket.on('requestaccess', (cam, data) => {
      socket.join(cam.id);
      socket.room = cam.id;
      const room = io.socket.adapter.rooms[socket.room];
      io.sockets.in(cam.id).emit('requestaccess', data);
    });

    socket.on('leavestream', cam => {
      socket.leave(cam.id);
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
