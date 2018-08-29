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
  };

  setUpStream = () => {
    console.log('media constraints ', this.mediaStreamConstraints);
    navigator.mediaDevices
      .getUserMedia(this.mediaStreamConstraints)
      .then(this.gotLocalMediaStream)
      .then(this.createPeerConnection())
      .then(() => {
        this.pc.addStream(this.localStream);
      })
      .then(() => {
        this.newOffer();
      })
      .then(() => {
        console.log('peer connection ', this.pc);
      })
      .catch(this.handleLocalMediaStreamError);
  };

  setUpRecipient = () => {
    console.log('recipient setting up');
    this.createPeerConnection();
    this.newOffer({ offerToReceiveVideo: true });
    console.log('recipient pc ', this.pc);
  };

  gotLocalMediaStream = mediaStream => {
    console.log('mediaStream ', mediaStream);
    this.localStream = mediaStream;
    const localVideo = document.getElementById('localVideo');
    localVideo.srcObject = mediaStream;
  };

  createPeerConnection = () => {
    try {
      this.pc = new RTCPeerConnection(PC_CONFIG);
      this.pc.onicecandidate = this.handleIceCandidate;
      this.pc.onaddstream = this.handleRemoteStreamAdded;
      this.pc.onremovestream = this.handleRemoteStreamRemoved;
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

  newOffer = options => {
    this.pc.createOffer(options).then(offer => this.pc.setLocalDescription(offer));

    // then send localDescription through server to other client
  };
}

export default PeerConnectionContainer;
