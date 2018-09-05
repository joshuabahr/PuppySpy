import { Container } from 'unstated';

class MotionDetectionContainer extends Container {
  state = {
    motionDetected: false
  };

  getLocalStream = stream => {
    console.log('local stream from MotionDetection ', stream);
  };
}

export default MotionDetectionContainer;
