import React from 'react';

// Video, receive streaming, socket.io and webRTC goes here

const ViewCamDetail = ({ cam: { id, camName, userId, password } }) => (
  <div>
    <div>
      <h5>Cam Name: {camName}</h5>
    </div>
    <div>Cam ID: {id}</div>
    <div>User ID: {userId}</div>
    <div>Password: {password}</div>
  </div>
);

export default ViewCamDetail;
