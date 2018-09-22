import React from 'react';

const Tech = () => (
  <div>
    <h4>Technology utilized in creating this app</h4>
    <br />
    <h5>Front End:</h5>
    <p>
      This app was built using React. State management is handled using Unstated. Styling is done with Bootstrap and
      CSS.
    </p>
    <br />
    <h5>Back End:</h5>
    <p>
      Utilizes a Node.js/Express web server. PostgreSQL database is used to store user information. Sequelize is used to
      handle database queries
    </p>
    <br />
    <h5>Video Streaming:</h5>
    <p>
      Video streaming is implemented with WebRTC. The signaling server to connect WebRTC clients is handled using
      Socket.io.
    </p>
    <br />
    <h5>Motion Detection:</h5>
    <p>
      Motion detection is handled entirely through JavaScript. A downscaled capture of the local stream is attached to a
      canvas element, and the difference between subsequent frames is calculated. Motion capture techniques were
      influenced by this <a href="https://codersblock.com/blog/motion-detection-with-javascript/">blog post</a>.
    </p>
    <br />
    <h5>SMS Notification:</h5>
    <p>Twilio is used to handle SMS alerts.</p>
  </div>
);

export default Tech;
