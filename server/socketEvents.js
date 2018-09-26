const socketEvents = io => {
  io.on('connect', socket => {
    console.log('socket connected ', socket.connected);

    socket.on('enterroom', cam => {
      socket.join(cam.id);
      console.log('entered stream ', cam);
      const room = io.sockets.adapter.rooms[cam.id];
      console.log('room ', room);
    });

    socket.on('leavestream', cam => {
      socket.leave(cam.id);
      console.log('leaving stream ', cam);
    });

    socket.on('streamerdescription', details => {
      socket.broadcast.to(details.cam.id).emit('streamerdescription', details.sdp);
      console.log('streamer description ', details.cam.id);
    });

    socket.on('recipientdescription', details => {
      socket.broadcast.to(details.cam.id).emit('recipientdescription', details.sdp);
      console.log('recipient description ', details.cam.id);
    });

    socket.on('icecandidate', details => {
      socket.broadcast.to(details.cam.id).emit('newice', details);
    });

    socket.on('closestream', cam => {
      socket.broadcast.to(cam.id).emit('closestream', cam);
      console.log('stream closed ', cam);
    });

    socket.on('remoteclosestream', cam => {
      socket.broadcast.to(cam.id).emit('remoteclosestream', cam);
      console.log('stream remotely closed ', cam);
    });

    socket.on('disconnect', () => {
      console.log('socket disconnected ', socket.connected);
    });
  });
};

module.exports = socketEvents;
