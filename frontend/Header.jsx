import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Auth from './Auth/Auth';

const auth = new Auth();

class Header extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    console.log('header props ', this.props);
  }

  login() {
    auth.login();
  }

  logout() {
    auth.logout();
  }

  render() {
    let list;
    const loggedIn = (
      <ul>
        <li>
          <Link to="/" onClick={this.logout}>
            Log Out
          </Link>
        </li>
        <li>
          <Link to="/Profile">Profile</Link>
        </li>
        <li>
          <Link to="/ViewCam">View Cams</Link>
        </li>
        <li>
          <Link to="/SetCam">Set Cams</Link>
        </li>
      </ul>
    );

    const loggedOut = (
      <ul>
        <li>
          <Link to="/Callback" onClick={this.login}>
            Log In
          </Link>
        </li>
      </ul>
    );

    if (!auth.isAuthenticated()) {
      list = loggedOut;
    } else {
      list = loggedIn;
    }

    return (
      <header>
        <nav>{list}</nav>
      </header>
    );
  }
}

export default Header;
