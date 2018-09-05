import { Container } from 'unstated';
import io from 'socket.io-client';

const socket = io();

const PC_CONFIG = { iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] };

class PeerConnectionContainer extends Container {
  cam = null;

  pc = null;

  localStream = null;

  mediaStreamConstraints = {
    audio: false,
    video: { width: 640, height: 480 }
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
      console.log('setting recipient description');
      this.pc
        .setRemoteDescription(sdp)
        .then(() => {
          this.pc.addStream(this.localStream);
        })
        .then(() => this.pc.createAnswer())
        .then(answer => {
          console.log('answer ', answer);
          this.pc.setLocalDescription(answer);
        })
        .then(() => {
          console.log('streamer PC ', this.pc);
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
    this.pc
      .createOffer({ offerToReceiveVideo: true })
      .then(offer => {
        this.pc.setLocalDescription(offer);
      })
      .then(() => {
        console.log('sending recipient description ', this.pc);
        this.sendRecipientDescription();
      });
  };

  gotLocalMediaStream = mediaStream => {
    this.localStream = mediaStream;
    const localVideo = document.getElementById('localVideo');
    localVideo.srcObject = mediaStream;
  };

  createPeerConnection = () => {
    try {
      this.pc = new RTCPeerConnection(PC_CONFIG);
      this.pc.onicecandidate = this.handleIceCandidate;
      this.pc.ontrack = this.handleRemoteStreamAdded;
      this.pc.onremovetrack = this.handleRemoteStreamRemoved;
      this.pc.oniceconnectionstatechange = this.handleIceStateChange;
      console.log('Created RTCPeerConnection');
    } catch (e) {
      console.log('Failed to create PeerConnection, exception: ', e.message);
    }
  };

  handleIceCandidate = event => {
    console.log('icecandidate event ', event);
    if (event.candidate) {
      socket.emit('icecandidate', {
        type: 'candidate',
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
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
    console.log('sending recipient description');
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

  handleStreamClose = cam => {
    socket.emit('leavestream', cam);
    socket.removeAllListeners();
    this.cam = null;
    console.log('stream is closed');
  };

  handleLogOut = cam => {
    socket.emit('leavestream', cam);
    socket.removeAllListeners();
    this.pc.close();
    this.pc = null;
    this.cam = null;
    console.log('pc is closed ', this.pc, this.cam);
  };
}

export default PeerConnectionContainer;
