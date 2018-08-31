import React, { Component } from 'react';
import axios from 'axios';
import Auth from './Auth/Auth';

const auth = new Auth();

class Home extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    console.log('props ', this.props);
    auth.getProfile((error, profile) => {
      if (!profile) {
        console.log('error in getProfile ', error);
      } else {
        this.registerUser(profile);
      }
    });
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

  logout() {
    auth.logout();
  }

  render() {
    const {
      userStore: {
        state: { name }
      }
    } = this.props;
    return (
      <div>
        <h1>This is the Home Page</h1>
        <h4>Thanks for logging in, {name} </h4>
      </div>
    );
  }
}

export default Home;
