# PuppySpy

Turn any webcam into a private security feed accessible from any device with internet access.

#### To try it out, visit https://www.puppyspy.tech.

---

## Features

### Private Security Feed

Set up your home device as a private security feed. Log in to the same account on any other device, and you can view any streams previously set up. Additionally, users can authorize other users with a PuppySpy account to view their streams.

### Motion Detection With SMS Alerts

PuppySpy has a motion detection feature which will alert users to any unexpected activity occurring within their security feed. Simply add a valid US phone number to the profile and enable motion detection. Users will receive an SMS alert whenever motion is detected in their security feed.

---

## Technology

The frontend was built and styled using React, Unstated, Bootstrap, and CSS.

WebRTC is utilized to create P2P connections enabling the streaming of video data.

Motion detection is implemented using JavaScript and HTML5 features.

The backend consists of a Node.js/Express server, and PostgreSQL database. Sequelize is used to handle database queries. Socket.io handles the signaling server needs to create the WebRTC P2P connection.
