/* eslint-disable */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Landing extends Component {
  login() {
    this.props.auth.login();
  }

  render() {

    return (
      <div>
        <h1>This is the Landing Page</h1>
        <Link to="/Callback" onClick={this.login.bind(this)}>
          Log In
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
