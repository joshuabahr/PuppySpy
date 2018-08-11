import React from 'react';

// video capture, setup streaming, webRTC and socket.io functionality goes here
// add user functionality
// close cam
const SetCamDetail = ({ cam: { id, camName, userId, password } }) => (
  <div>
    <div>
      <h5>Cam Name: {camName}</h5>
    </div>
    <div>Cam ID: {id}</div>
    <div>User ID: {userId}</div>
    <div>Password: {password}</div>
  </div>
);

export default SetCamDetail;
