/*
eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["videoElem"] }]
*/

import { Container } from 'unstated';
import io from 'socket.io-client';

const socket = io();

const PC_CONFIG = { iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] };

class PeerConnectionContainer extends Container {
  cam = null;

  pc = null;

  localStream = null;

  localVideo = null;

  mediaStreamConstraints = {
    audio: false,
    video: { width: 640, height: 480 }
  };

  state = {
    streamClosed: false
  };

  setCam = cam => {
    this.cam = cam;
    socket.connect();
    socket.emit('enterroom', cam);
  };

  setUpStream = () => {
    console.log('media constraints ', this.mediaStreamConstraints);
    navigator.mediaDevices
      .getUserMedia(this.mediaStreamConstraints)
      .then(this.gotLocalMediaStream)
      .then(() => {
        console.log('setUpStream localStream ', this.localStream);
      })
      .catch(this.handleLocalMediaStreamError);
  };

  setAndSendStreamDescription = () => {
    socket.on('recipientdescription', sdp => {
      this.createPeerConnection();
      console.log('setting recipient description', sdp);
      this.pc
        .setRemoteDescription(sdp)
        .then(() => {
          this.localStream.getTracks().forEach(t => this.pc.addTrack(t, this.localStream));
        })
        .then(() => this.pc.createAnswer())
        .then(answer => {
          console.log('answer ', answer);
          return this.pc.setLocalDescription(answer);
        })
        .then(() => {
          console.log('streamer this.pc ', this.pc);
          this.sendStreamerDescription();
        })
        .catch(error => {
          console.log('error creating answer ', error);
        });
    });
  };

  setUpRecipient = () => {
    console.log('recipient setting up ', this.cam);
    this.createPeerConnection();
    console.log('recipient setting up 2 ', this.pc.localDescription);
    this.pc
      .createOffer({ offerToReceiveVideo: true })
      .then(offer => this.pc.setLocalDescription(offer))
      .then(() => {
        console.log('peer connection', this.pc.localDescription);
      })
      .then(() => {
        this.sendRecipientDescription();
      })
      .catch(e => {
        console.log('error recipient set up ', e);
      });
  };

  gotLocalMediaStream = mediaStream => {
    this.localStream = mediaStream;
    this.localVideo = document.getElementById('localVideo');
    this.localVideo.srcObject = mediaStream;
    console.log('localVideo ', this.localVideo);
  };

  createPeerConnection = () => {
    try {
      this.pc = new RTCPeerConnection(PC_CONFIG);
      console.log('first pc ', this.pc.localDescription);
      this.pc.onicecandidate = this.handleIceCandidate;
      this.pc.ontrack = this.handleRemoteStreamAdded;
      this.pc.onremovetrack = this.handleRemoteStreamRemoved;
      this.pc.oniceconnectionstatechange = this.handleIceStateChange;
      console.log('Created RTCPeerConnection', this.pc.localDescription);
    } catch (e) {
      console.log('Failed to create PeerConnection, exception: ', e.message);
    }
  };

  handleIceCandidate = event => {
    console.log('icecandidate event ', event);
    if (event.candidate) {
      socket.emit('icecandidate', {
        type: 'candidate',
        sdpMLineIndex: event.candidate.sdpMLineIndex,
        sdpMid: event.candidate.sdpMid,
        candidate: event.candidate.candidate,
        cam: this.cam
      });
    } else {
      console.log('End of Candidates');
    }
  };

  handleNewIce = () => {
    socket.on('newice', details => {
      console.log('new ice candidate ', details);
      this.pc.addIceCandidate(details).catch(e => console.log('failure to add ice candidate ', e.name));
    });
  };

  handleIceStateChange = () => {
    console.log('Ice state change ', this.pc.iceConnectionState);
  };

  handleRemoteStreamAdded = e => {
    const mediaStream = e.streams[0];
    const remoteVideo = document.getElementById('remoteVideo');
    remoteVideo.srcObject = mediaStream;
    console.log('track running ', remoteVideo.srcObject);
  };

  handleRemoteStreamRemoved = event => {
    console.log('Remote stream removed ', event);
    const remoteVideo = document.getElementById('remoteVideo');
    remoteVideo.srcObject = null;
  };

  handleLocalMediaStreamError = error => {
    console.log('navigator.getUserMedia error: ', error);
  };

  sendStreamerDescription = () => {
    console.log('sending streamer description');
    socket.emit('streamerdescription', {
      cam: this.cam,
      sdp: this.pc.localDescription
    });
  };

  sendRecipientDescription = () => {
    console.log('sending recipient description 4', this.pc);
    socket.emit('recipientdescription', {
      cam: this.cam,
      sdp: this.pc.localDescription
    });
  };

  setStreamerDescription = () => {
    socket.on('streamerdescription', sdp => {
      this.pc.setRemoteDescription(sdp).then(() => {
        console.log('streamer description added ', this.pc);
      });
    });
  };

  handleLogOut = cam => {
    console.log('handle log out cam ', cam);
    console.log('logout src object', this.localVideo.srcObject);
    socket.emit('closestream', cam);
    socket.emit('leavestream', cam);
    socket.removeAllListeners();
    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }
    this.stopStreamedVideo(this.localVideo);
    this.cam = null;
    this.localStream = null;
    console.log('this.pc is closed ', this.pc, this.cam);
  };

  handleCloseRemoteViewing = cam => {
    socket.emit('leavestream', cam);
    socket.removeAllListeners();
    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }
    this.cam = null;
    console.log('this.pc is closed ', this.pc, this.cam);
  };

  remoteCloseStream = cam => {
    socket.connect();
    socket.emit('enterroom', cam);
    socket.emit('remoteclosestream', cam);
    socket.emit('leavestream', cam);
  };

  handleRemoteCloseStream = () => {
    socket.on('remoteclosestream', () => {
      console.log('handle remote close stream');
      socket.emit('leavestream', this.cam);
      socket.removeAllListeners();
      if (this.pc) {
        this.pc.close();
        this.pc = null;
      }
      this.stopStreamedVideo(this.localVideo);
      this.cam = null;
      this.localStream = null;
      this.setState({ streamClosed: true });
    });
  };

  handleViewStreamClosed = () => {
    socket.on('closestream', () => {
      socket.emit('leavestream', this.cam);
      socket.removeAllListeners();
      if (this.pc) {
        this.pc.close();
        this.pc = null;
      }
      this.cam = null;
      this.localStream = null;
      this.setState({ streamClosed: true });
    });
  };

  stopStreamedVideo = videoElem => {
    const stream = videoElem.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => {
      track.stop();
    });

    videoElem.srcObject = null;
  };

  streamClosedFalse = () => {
    this.setState({
      streamClosed: false
    });
  };
}

export default PeerConnectionContainer;
