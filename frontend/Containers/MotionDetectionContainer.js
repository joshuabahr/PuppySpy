import { Container } from 'unstated';

class MotionDetectionContainer extends Container {
  state = {
    motionDetected: false,
    motionDetectionActive: false
  };

  captureStream = null;

  video = document.createElement('video');

  motionCanvas = document.createElement('canvas');

  captureCanvas = document.createElement('canvas');

  diffCanvas = document.createElement('canvas');

  captureIntervalTime = 1000;

  captureInterval = null;

  captureWidth = 640;

  captureHeight = 480;

  diffWidth = 64;

  diffHeight = 48;

  pixelDiffThreshold = 32;

  scoreThreshold = 100;

  isReadyToDiff = false;

  captureContext = null;

  diffContext = null;

  motionContext = null;

  getLocalStream = stream => {
    if (stream) {
      this.captureStream = stream;
    }
    this.setMotionDetectionActive();
    this.isReadyToDiff = false;
    this.video.autoplay = true;

    this.diffCanvas.width = this.diffWidth;
    this.diffCanvas.height = this.diffHeight;
    this.diffContext = this.diffCanvas.getContext('2d');

    this.motionCanvas.width = this.diffWidth;
    this.motionCanvas.height = this.diffHeight;
    this.motionContext = this.motionCanvas.getContext('2d');

    this.video.srcObject = this.captureStream;
    console.log('MotionDetection set up ', this);

    this.captureInterval = setInterval(this.capture, this.captureIntervalTime);
  };

  capture = () => {
    this.diffContext.globalCompositeOperation = 'difference';
    this.diffContext.drawImage(this.video, 0, 0, this.diffWidth, this.diffHeight);
    const diffImageData = this.diffContext.getImageData(0, 0, this.diffWidth, this.diffHeight);

    if (this.isReadyToDiff) {
      const diff = this.processDiff(diffImageData);

      console.log('diff value ', diff);

      this.motionContext.putImageData(diffImageData, 0, 0);

      if (diff >= this.scoreThreshold) {
        this.motionDetection();
      }
    }

    this.diffContext.globalCompositeOperation = 'source-over';
    this.diffContext.drawImage(this.video, 0, 0, this.diffWidth, this.diffHeight);
    this.isReadyToDiff = true;
  };

  processDiff = diffImageData => {
    const rgba = diffImageData.data;

    let score = 0;

    for (let i = 0; i < rgba.length; i += 4) {
      const pixelDiff = rgba[i] * 0.3 + rgba[i + 1] * 0.6 + rgba[i + 2] * 0.1;
      const normalized = Math.min(255, pixelDiff * (255 / this.pixelDiffThreshold));
      rgba[i] = 0;
      rgba[i + 1] = normalized;
      rgba[i + 2] = 0;

      if (pixelDiff >= this.pixelDiffThreshold) {
        score += 1;
      }
    }

    return score;
  };

  motionDetection = () => {
    clearInterval(this.captureInterval);
    this.setState({ motionDetected: true });
    setTimeout(() => {
      this.setState({ motionDetected: false });
      if (this.state.motionDetectionActive) {
        this.getLocalStream();
      }
    }, 5000);
  };

  setMotionDetectionActive = () => {
    this.setState({ motionDetectionActive: true });
  };

  stopMotionDetection = () => {
    clearInterval(this.captureInterval);
    this.captureInterval = null;
    this.setState({ motionDetectionActive: false }).then(() => {
      console.log('stop motion detection ', this.state.motionDetectionActive);
    });
  };
}

export default MotionDetectionContainer;
