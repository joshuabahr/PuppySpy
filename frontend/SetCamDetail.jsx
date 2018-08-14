import React, { Component } from 'react';
import axios from 'axios';

// video capture, setup streaming, webRTC and socket.io functionality goes here
// add user functionality
// close cam
class SetCamDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addUser: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.allowCamUser = this.allowCamUser.bind(this);
  }

  handleInputChange = e => {
    const input = {};
    input[e.target.name] = e.target.value;
    this.setState(() => input);
  };

  allowCamUser() {
    const camId = this.props.cam.id;
    const email = this.state.addUser;
    axios
      .post(`api/cam/adduser`, {
        camId,
        email
      })
      .then(response => {
        console.log('allowed user access to cam ', response);
      })
      .then(() => {
        this.setState({
          addUser: ''
        });
      });
  }

  render() {
    const {
      cam: { id, camName, userId, password },
      setCamStore: { deleteCam }
    } = this.props;

    const { addUser } = this.state;

    return (
      <div>
        <div>
          <h5>Cam Name: {camName}</h5>
        </div>
        <div>Cam ID: {id}</div>
        <div>User ID: {userId}</div>
        <div>Password: {password}</div>
        <div>
          allow user access (email):
          <input type="text" name="addUser" onChange={this.handleInputChange} value={addUser} />
          <button type="button" onClick={this.allowCamUser}>
            Add
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={() => {
              deleteCam(id, userId);
            }}
          >
            Delete Stream
          </button>
        </div>
      </div>
    );
  }
}

export default SetCamDetail;
