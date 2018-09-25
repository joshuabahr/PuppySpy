import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Auth from './Auth/Auth';

const auth = new Auth();

class Home extends Component {
  constructor(props) {
    super(props);

    this.registerUser = this.registerUser.bind(this);
  }

  componentDidMount() {
    console.log('Home props ', this.props);

    const {
      userStore: {
        state: { loggedIn }
      }
    } = this.props;
    console.log('logged in ', loggedIn);
    if (!loggedIn) {
      auth.getProfile((error, profile) => {
        if (!profile) {
          console.log('error in getProfile ', error);
        } else {
          this.registerUser(profile);
        }
      });
    }
  }

  registerUser(profile) {
    const {
      userStore: { logInUser }
    } = this.props;
    axios
      .post(`api/user/signup`, profile)
      .then(response => {
        console.log(response.data);
        logInUser(response.data);
      })
      .catch(error => {
        console.log('error in registerUser ', error);
      });
  }

  render() {
    const {
      userStore: {
        state: { name }
      }
    } = this.props;
    return (
      <div>
        <h4>Thank you for using PuppySpy, {name}.</h4>
        <ul>
          <li>
            To set up your current device as a security feed or end a current feed,{' '}
            <Link to="/SetCam">Manage Streams</Link>
          </li>
          <li>
            To view your available security feeds, <Link to="/ViewCam">View Streams</Link>
          </li>
          <li>
            To enable motion detection alerts, add a SMS-enabled phone number to <Link to="/Profile">Profile</Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default Home;
