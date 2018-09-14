import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavbarToggler, NavbarBrand, Collapse, Nav, NavItem, NavLink } from 'reactstrap';
import Auth from './Auth/Auth';

const auth = new Auth();

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };

    this.toggle = this.toggle.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    console.log('header props ', this.props);
  }

  toggle() {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  login() {
    auth.login();
  }

  logout() {
    auth.logout();
  }

  render() {
    const { isOpen } = this.state;

    let list;
    const loggedIn = (
      <div id="nav">
        <Navbar dark className="my-navbar" expand="md">
          <NavbarBrand className="my-navbarbrand" href="/Home">
            PuppySpy
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav navbar>
              <NavItem>
                <NavLink tag={Link} to="/" onClick={this.logout}>
                  Log Out
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/Profile" onClick={this.toggle}>
                  Profile
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/ViewCam" onClick={this.toggle}>
                  View Streams
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/SetCam" onClick={this.toggle}>
                  Manage Streams
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );

    const loggedOut = (
      <div>
        <Navbar expand="md">
          <NavbarBrand href="/Home">PuppySpy</NavbarBrand>
          <Nav navbar className="mr-auto">
            <NavItem>
              <NavLink tag={Link} to="/Callback" onClick={this.login}>
                Log In
              </NavLink>
            </NavItem>
          </Nav>
        </Navbar>
      </div>
    );

    if (!auth.isAuthenticated()) {
      list = loggedOut;
    } else {
      list = loggedIn;
    }

    return <div>{list}</div>;
  }
}

export default Header;
