const socketEvents = io => {
  io.on('connect', socket => {
    console.log('socket connected ', socket.connected);

    socket.on('enterstream', cam => {
      socket.join(cam.id);
      console.log('entered stream ', cam);
      socket.room = cam.id;
      const room = io.sockets.adapter.rooms[socket.room];
      console.log('room ', room);
    });

    socket.on('requeststream', data => {
      const { cam, requestInfo } = data;
      socket.join(cam.id);
      console.log('request stream ', requestInfo);
      socket.room = cam.id;
      const room = io.sockets.adapter.rooms[socket.room];
      io.sockets.in(cam.id).emit('requeststream', requestInfo);
    });

    socket.on('sendstream', data => {
      const { cam, streamInfo } = data;
      io.sockets.in(cam.id).emit('sendstream', streamInfo);
    });

    socket.on('leavestream', cam => {
      socket.leave(cam.id);
      console.log('leaving stream ', cam);
    });

    socket.on('offer', (cam, details) => {
      socket.join(cam.id);
      socket.room = cam.id;
      const room = io.sockets.adapter.rooms[socket.room];
      io.sockets.in(cam.id).emit('offer', details);
      console.log('offer ', JSON.stringify(details));
    });

    socket.on('answer', (cam, details) => {
      socket.join(cam.id);
      socket.room = cam.id;
      const room = io.socket.adapter.rooms[socket.room];
      io.sockets.in(cam.id).emit('answer', details);
      console.log('answer ', JSON.stringify(details));
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
