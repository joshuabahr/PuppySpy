/* eslint-disable */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Auth from './Auth/Auth';

const auth0 = new Auth();

class Landing extends Component {
  
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  registerUser(profile) {
    axios
      .post(`api/user/signup`, profile)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log('error in registerUser ', error);
      });
  }

  logout() {
    auth0.logout();
  }

  /*
  static fetchProfile(profile) {
    axios.get(`api/user/profile/${profile.id}`)
      .then((response) => {
        console.log('fetched user profile ', response.data);
      })
      .catch((error) => {
        console.log('error in fetchProfile ', error);
      })
  }
*/


  componentDidMount() {
    auth0.getProfile((error, profile) => {
      if (!profile) {
        console.log('error in getProfile ', error);
      } else {
        this.registerUser(profile);
      }
    });
  }

  render() {
    return (
      <div>
        <h1>This is the Landing Page</h1>
        <Link to="/" onClick={this.logout}>
          Log Out
        </Link>
        <br />
        <Link to="/Profile">Profile</Link>
        <br />
        <Link to="/Test">Test</Link>
        <br />
        <Link to="/Callback">Callback</Link>
      </div>
    );
  }
}

export default Landing;
