import { Container } from 'unstated';
import io from 'socket.io-client';

const socket = io();

const PC_CONFIG = { iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] };
let pc = null;
let localStream = null;
const mediaStreamConstraints = {
  audio: false,
  video: { width: 640, height: 480 }
};

class PeerConnectionContainer extends Container {
  setUpStream = () => {
    console.log('media constraints ', mediaStreamConstraints);
    navigator.mediaDevices
      .getUserMedia(mediaStreamConstraints)
      .then(this.gotLocalMediaStream)
      .then(this.createPeerConnection())
      .then(() => {
        pc.addStream(localStream);
      })
      .then(() => {
        this.newOffer();
      })
      .then(() => {
        console.log('peer connection ', pc);
      })
      .catch(this.handleLocalMediaStreamError);
  };

  gotLocalMediaStream = mediaStream => {
    console.log('mediaStream ', mediaStream);
    localStream = mediaStream;
    const localVideo = document.getElementById('localVideo');
    localVideo.srcObject = mediaStream;
  };

  createPeerConnection = () => {
    try {
      pc = new RTCPeerConnection(PC_CONFIG);
      pc.onicecandidate = this.handleIceCandidate;
      pc.onaddstream = this.handleRemoteStreamAdded;
      pc.onremovestream = this.handleRemoteStreamRemoved;
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
        candidate: event.candidate.candidate
      });
    } else {
      console.log('End of Candidates');
    }
  };

  handleRemoteStreamAdded = event => {
    const mediaStream = event.stream;
    const remoteVideo = document.getElementById('remoteVideo');
    remoteVideo.srcObject = mediaStream;
  };

  handleRemoteStreamRemoved = event => {
    console.log('Remote stream removed ', event);
  };

  handleLocalMediaStreamError = error => {
    console.log('navigator.getUserMedia error: ', error);
  };

  newOffer = () => {
    pc.createOffer().then(offer => pc.setLocalDescription(offer));

    // then send localDescription through server to other client
  };
}

export default PeerConnectionContainer;
